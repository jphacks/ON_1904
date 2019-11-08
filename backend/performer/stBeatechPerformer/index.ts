import { GetItemOutput } from 'aws-sdk/clients/dynamodb';
import response from './modules/response';
import lineReplay from './modules/lineReply';
import lineImage from './modules/lineImage';
import accessDb from './modules/accessDb';
import s3 from './modules/aws/s3';
import spotify from './modules/spotify';
import enums from './modules/enums';

// メイン処理
exports.handler = async (event: any, context: any): Promise<void> => {
  console.log(event);

  const jsonBody = JSON.parse(event.body);
  const { userId } = jsonBody.events[0].source;
  const reqText = jsonBody.events[0].message.text;
  const repToken = jsonBody.events[0].replyToken;

  // テスト送信
  if (repToken === '00000000000000000000000000000000') {
    context.succeed(response.createResponse(200, 'Completed successfully !!'));
    console.log('Success: Response completed successfully !!');
  } else {
    let resText = '';
    let userData: GetItemOutput;
    // ステート取得
    try {
      userData = await accessDb.getUserById(userId);
      console.log({ userData });
    } catch (err) {
      resText = '予期しないエラーが発生しました。(ErrorCode:001)';
      console.log(`Get USER DATA Filed : ${err}`);

      await lineReplay.replyLine(repToken, resText);
      context.succeed(response.createResponse(200, 'Completed successfully !!'));

      return;
    }
    // ステータス取得
    let performerState: number;
    if (userData.Item.performerState) {
      performerState = Number(userData.Item.performerState.N);
    } else {
      performerState = enums.performerState.NOT_SET;
      accessDb.updatePerformerState(userId, performerState);
    }
    switch (reqText) {
      case 'start': {
        if (performerState < enums.performerState.READY) {
          resText = '設定が完了していないため、ライブを開始できません';
          break;
        }
        if (performerState === enums.performerState.LIVE) {
          resText = 'ライブ中です';
          break;
        }
        accessDb.updateIsPerformed(userId, true);
        accessDb.updateTrackNo(userId, 1);
        accessDb.updatePerformerState(userId, enums.performerState.LIVE);
        resText = 'ライブを開始しました';
        break;
      }
      case 'stop': {
        if (performerState < enums.performerState.LIVE) {
          resText = 'ライブを開始していないため、ライブを終了できません';
          break;
        }
        accessDb.updateIsPerformed(userId, false);
        accessDb.updatePerformerState(userId, enums.performerState.READY);
        resText = 'ライブを終了しました';
        break;
      }
      case 'next': {
        if (performerState < enums.performerState.READY) {
          resText = 'まだライブが開始されていません';
          break;
        }
        // currentSongNumは1からスタート
        const currentSongNum = Number(userData.Item.trackNo.N);
        const songNum = userData.Item.songs.L.length;
        if (currentSongNum + 1 > songNum) {
          resText = '次の曲がありません';
          break;
        }
        accessDb.incrementTrackNo(userId);
        const nextSong = userData.Item.songs.L[currentSongNum].S;
        resText = `次の曲になりました。曲名：${nextSong}`;
        break;
      }
      case 'setlist': {
        if (performerState < enums.performerState.SET_SETLIST) {
          resText = '[Error] Edit Profileから初期設定をおこなってください';
          break;
        }
        resText = 'spotifyのプレイリストのURLを送信してください';
        accessDb.updatePerformerState(userId, enums.performerState.SET_SETLIST);
        break;
      }
      case 'profile': {
        if (performerState === enums.performerState.LIVE) {
          resText = 'LIVE中はプロフィールを変更できません';
          break;
        }
        resText = '表示名を送信してください';
        accessDb.updatePerformerState(userId, enums.performerState.SET_NAME);
        break;
      }
      case 'hwid': {
        if (performerState <= enums.performerState.SET_HWID) {
          resText = 'まだHWIDが設定されていません';
          break;
        }
        resText = `あなたのHWIDは ${userData.Item.hwid.S} です`;
        break;
      }
      default: {
        switch (performerState) {
          case enums.performerState.SET_NAME: {
            accessDb.updateName(userId, reqText);
            resText = 'サムネイル画像のURLを送信してください';
            accessDb.updatePerformerState(userId, enums.performerState.SET_PHOTO);
            break;
          }
          case enums.performerState.SET_PHOTO: {
            // const { type, id } = jsonBody.events[0].message;
            // if (type !== 'image') {
            //   resText = '画像を送信してください';
            //   break;
            // }
            // // 画像データ取得
            // const imageData: Buffer[] = [];
            // const imageRes = await lineImage.getLineImage(id);
            // console.log('Get imageRes');
            // imageRes
            //   .on('data', (chunk) => {
            //     imageData.push(Buffer.from(chunk));
            //   })
            //   .on('end', () => {
            //     console.log('Save Image');
            //     s3.saveImage(imageData, userId);
            //   });
            accessDb.updatePhotoUrl(userId, reqText);
            resText = 'アピール文章を送信してください';
            accessDb.updatePerformerState(userId, enums.performerState.SET_DESCRIPTION);
            break;
          }
          case enums.performerState.SET_DESCRIPTION: {
            accessDb.updateDescription(userId, reqText);
            resText = 'twitterのIDを送信してください';
            accessDb.updatePerformerState(userId, enums.performerState.SET_TWITTER);
            break;
          }
          case enums.performerState.SET_TWITTER: {
            accessDb.updateTwitter(userId, reqText);
            resText = 'ビーコンのIDを送信してください';
            accessDb.updatePerformerState(userId, enums.performerState.SET_HWID);
            break;
          }
          case enums.performerState.SET_HWID: {
            accessDb.updateHwid(userId, reqText);
            resText = 'spotifyのプレイリストのURLを送信してください';
            accessDb.updatePerformerState(userId, enums.performerState.SET_SETLIST);
            break;
          }
          case enums.performerState.SET_SETLIST: {
            if (reqText.match(/^https:\/\/open.spotify.com\/playlist\/[0-9a-zA-Z]+$/)) {
              const [playlistId] = reqText.match(/[0-9a-zA-Z]+$/);
              const accessToken = await spotify.getAccessToken();
              const songs = await spotify.getSetlistSongs(accessToken, playlistId);
              accessDb.updatePlaylist(userId, songs);
              resText = 'プレイリストが登録されました。';
              accessDb.updatePerformerState(userId, enums.performerState.READY);
            } else {
              resText = '不正なリクエストです。';
            }
            break;
          }
          default: {
            resText = '不正なリクエストです。';
            break;
          }
        }
        break;
      }
    }

    console.log(`Replay Message : ${resText}`);

    await lineReplay.replyLine(repToken, resText);
    context.succeed(response.createResponse(200, 'Completed successfully !!'));
  }
};

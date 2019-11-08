import response from './modules/response';
import lineReplay from './modules/lineReply';
import accessDb from './modules/accessDb';
import spotify from './modules/spotify';
import enums from './modules/enums';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

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
        resText = 'ここはプロフィール';
        break;
      }
      default: {
        if (reqText.match(/^https:\/\/open.spotify.com\/playlist\/[0-9a-zA-Z]+$/)) {
          const [playlistId] = reqText.match(/[0-9a-zA-Z]+$/);
          const accessToken = await spotify.getAccessToken();
          const songs = await spotify.getSetlistSongs(accessToken, playlistId);
          accessDb.updatePlaylist(userId, songs);
          resText = 'プレイリストが登録されました。';
        } else {
          resText = '不正なリクエストです。';
        }
        break;
      }
    }

    console.log(`Replay Message : ${resText}`);

    await lineReplay.replyLine(repToken, resText);
    context.succeed(response.createResponse(200, 'Completed successfully !!'));
  }
};

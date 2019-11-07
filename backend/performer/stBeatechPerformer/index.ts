import response from './modules/response';
import lineReplay from './modules/lineReply';
import accessDb from './modules/accessDb';
import spotify from './modules/spotify';

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
    switch (reqText) {
      case 'start':
        accessDb.updateIsPerformed(userId, true);
        accessDb.updateTrackNo(userId, 1);
        resText = 'ライブを開始しました';
        break;
      case 'stop':
        accessDb.updateIsPerformed(userId, false);
        resText = 'ライブを終了しました';
        break;
      case 'next':
        accessDb.incrementTrackNo(userId);
        resText = '次の曲になりました';
        break;
      case 'setlist':
        resText = 'spotifyのプレイリストのURLを送信してください';
        break;
      default:
        if (reqText.match(/^https:\/\/open.spotify.com\/playlist\/[0-9a-zA-Z]+$/)) {
          const [playlistId] = reqText.match(/[0-9a-zA-Z]+$/);
          const accessToken = await spotify.getAccessToken();
          const songs = await spotify.getSetlistSongs(userId, accessToken, playlistId);
          accessDb.updatePlaylist(userId, songs);
          resText = 'プレイリストが登録されました。';
        } else {
          resText = '不正なリクエストです。';
        }
        break;
    }

    console.log(`Replay Message : ${resText}`);

    try {
      await lineReplay.replyLine(repToken, resText);
      context.succeed(response.createResponse(200, 'Completed successfully !!'));
    } catch (error) {
      console.log(`LINE API POST Filed : ${error}`);
    }
  }
};

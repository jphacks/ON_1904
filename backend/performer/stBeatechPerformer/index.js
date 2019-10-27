// LINEアクセストークン
const LINE_TOKEN = process.env.ACCESS_TOKEN;
const SPOTFIY_TOKEN = process.env.SPOTFIY_TOKEN;

const line = require('@line/bot-sdk');
const request = require('request');
const aws = require('aws-sdk');

const tableName = 'stBeatechPerformer';

const dynamoClient = new aws.DynamoDB.DocumentClient({region: 'us-west-2'});

// 成功時のレスポンス
const createResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify(body)
    }
};

// LINEへのReply
const replyLine = (repToken, resStr) => {
  const client = new line.Client({
    channelAccessToken: LINE_TOKEN
  });

  const message = {
    type: 'text',
    text: resStr
  };

  return client.replyMessage(repToken, message);
};

// プレイリストを更新する
const updateSongs = (userId, songs) => {
  console.log('updateSongs entered.');
  const params = {
    TableName: tableName,
    Key: {
      userId: userId
    },
    UpdateExpression: 'set songs = :s',
    ExpressionAttributeValues: {
      ':s':songs
    },
    ReturnValues: "UPDATED_NEW"
  };
  dynamoClient.update(params, (err, data) => {
    if(err) {
      console.log(`Songs updated filed : ${err}`);
    }
    console.log(`Songs updated : ${JSON.parse(data)}`);
  });
}

// メイン処理
exports.handler = (event, context) => {

  console.log(event);

  const jsonBody = JSON.parse(event.body);
  const userId = jsonBody.events[0].source.userId;
  const reqText = jsonBody.events[0].message.text;
  const repToken = jsonBody.events[0].replyToken;

  // テスト送信
  if (repToken == '00000000000000000000000000000000') {
    context.succeed(createResponse(200, 'Completed successfully !!'));
    console.log("Success: Response completed successfully !!");
  } else {
    let resText = '';
    switch(reqText) {
      case 'setlist':
        resText = 'spotifyのプレイリストのURLを送信してください';
        break;
      default:
        if (reqText.match(/^https:\/\/open.spotify.com\/playlist\/[0-9a-zA-Z]+$/)) {
          [playlistId] = reqText.match(/[0-9a-zA-Z]+$/);
          // spotify token取得
          const options = {
            uri: 'https://accounts.spotify.com/api/token',
            headers: {
              Authorization: `Basic ${SPOTFIY_TOKEN}`
            },
            form: {
              "grant_type": "client_credentials"
            }
          };
          request.post(options, (error, response, body) => {
            if(body) {
              const spotifyAccessToken = JSON.parse(body).access_token;
              const get_options = {
                headers: {
                  Authorization: `Bearer ${spotifyAccessToken}`
                }
              };
              console.log({spotifyAccessToken});
              request.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, get_options, (g_error, g_response, g_body) => {
                console.log(JSON.parse(g_body));
                if(g_body) {
                  const songs = [];
                  JSON.parse(g_body).items.forEach((el) => {
                    console.log(`name : ${el.track.name}`);
                    songs.push(el.track.name);
                  });
                  updateSongs(userId, songs);
                }
                if(g_error) {
                  console.log(g_error);
                  resText = 'エラーが発生しました。もう一度試してください。';
                }
              });
            }
            if(error) {
              console.log(error);
              resText = 'エラーが発生しました。もう一度試してください。';
            }
          });
        } else {
          resText = '不正なリクエストです。';
        }
        resText = 'プレイリストが登録されました。';
        break;
    }

    console.log(`Replay Message : ${resText}`);

    return replyLine(repToken, resText)
      .then(() => {
        context.succeed(createResponse(200, 'Completed successfully !!'));
      })
      .catch((error) => {
        console.log(`LINE API POST Filed : ${error}`);
      });
  }
}
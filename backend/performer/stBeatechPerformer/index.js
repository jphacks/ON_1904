// LINEアクセストークン
const LINE_TOKEN = process.env.ACCESS_TOKEN;

const line = require('@line/bot-sdk');

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

// メイン処理
exports.handler = (event, context) => {

  console.log(event);

  const jsonBody = JSON.parse(event.body);
  const reqText = jsonBody.events[0].message.text;
  const repToken = jsonBody.events[0].replyToken;

  // テスト送信
  if (repToken == '00000000000000000000000000000000') {
    context.succeed(createResponse(200, 'Completed successfully !!'));
    console.log("Success: Response completed successfully !!");
  } else {
    return replyLine(repToken, reqText).then(() => {
      context.succeed(createResponse(200, 'Completed successfully !!'));
    });
  }
}
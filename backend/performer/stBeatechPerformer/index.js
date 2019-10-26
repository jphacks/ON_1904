// LINEアクセストークン
const LINE_TOKEN = process.env.ACCESS_TOKEN;

const request = require('request');

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

// LINEへのReply
function replyLine(repToken, resStr) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.line.me/v2/bot/message/reply';

    let options = {
      uri: url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_TOKEN}`
      },
      json: {
        "replyToken": repToken,
        "messages": [{
          "type": "text",
          "text": resStr
        }]
      }
  };
  request.post(options, function (error, response, body) {
      if (!error) {
        console.log('Success: Communication successful completion !!');
        console.log(body);
        resolve();
      } else {
        console.log(`Failed: ${error}`);
        resolve();
      }
    });
  });
}
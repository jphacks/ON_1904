// LINEアクセストークン
const LINE_TOKEN = process.env.ACCESS_TOKEN;

const line = require('@line/bot-sdk');
const aws = require('aws-sdk');

const tableName = 'stBeatechPerformer';

const dynamoClient = new aws.DynamoDB.DocumentClient({region: 'us-west-2'});

const message = {
  "type": "flex",
  "altText": "this is a flex message",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "image",
          "url": "https://pbs.twimg.com/media/EH0ILk-U4AAk3UI?format=jpg&name=large",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "1:1",
          "gravity": "center"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "青のり",
                      "weight": "bold",
                      "size": "xl",
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "サウンドトラックやInstを中心にキーボードで全国を回っています",
                      "size": "xs",
                      "color": "#ffffff",
                      "wrap": true
                    }
                  ],
                  "paddingTop": "6px"
                }
              ],
              "spacing": "xs"
            }
          ],
          "position": "absolute",
          "offsetBottom": "0px",
          "offsetStart": "0px",
          "offsetEnd": "0px",
          "paddingAll": "18px",
          "backgroundColor": "#00000088"
        }
      ],
      "paddingAll": "0px"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "🎉 21:30〜 路上ライブ開催中",
          "color": "#939393",
          "size": "xs"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": "演奏中",
              "size": "sm",
              "gravity": "center"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "filler"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "filler"
                    }
                  ],
                  "cornerRadius": "30px",
                  "height": "12px",
                  "width": "12px",
                  "borderColor": "#EF454D",
                  "borderWidth": "2px"
                },
                {
                  "type": "filler"
                }
              ],
              "flex": 0
            },
            {
              "type": "text",
              "text": "HOT LIMIT",
              "gravity": "center",
              "flex": 4,
              "size": "sm"
            }
          ],
          "spacing": "lg",
          "cornerRadius": "30px",
          "margin": "xl"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "filler"
                }
              ],
              "flex": 1
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "filler"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "filler"
                        }
                      ],
                      "width": "2px",
                      "backgroundColor": "#EF454D"
                    },
                    {
                      "type": "filler"
                    }
                  ],
                  "flex": 1
                }
              ],
              "width": "12px"
            },
            {
              "type": "text",
              "text": " ",
              "gravity": "center",
              "flex": 4,
              "size": "xs",
              "color": "#8c8c8c"
            }
          ],
          "spacing": "lg",
          "height": "16px"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "次の曲",
                  "gravity": "center",
                  "size": "sm"
                }
              ],
              "flex": 1
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "filler"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "filler"
                    }
                  ],
                  "cornerRadius": "30px",
                  "width": "12px",
                  "height": "12px",
                  "borderWidth": "2px",
                  "borderColor": "#6486E3"
                },
                {
                  "type": "filler"
                }
              ],
              "flex": 0
            },
            {
              "type": "text",
              "text": "Rydeeen",
              "gravity": "center",
              "flex": 4,
              "size": "sm"
            }
          ],
          "spacing": "lg",
          "cornerRadius": "30px"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "filler"
                }
              ],
              "flex": 1
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "filler"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "filler"
                        }
                      ],
                      "width": "2px",
                      "backgroundColor": "#6486E3"
                    },
                    {
                      "type": "filler"
                    }
                  ],
                  "flex": 1
                }
              ],
              "width": "12px"
            },
            {
              "type": "text",
              "text": " ",
              "gravity": "center",
              "flex": 4,
              "size": "xs",
              "color": "#8c8c8c"
            }
          ],
          "spacing": "lg",
          "height": "16px"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": "2曲後",
              "gravity": "center",
              "size": "sm"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "filler"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "filler"
                    }
                  ],
                  "cornerRadius": "30px",
                  "width": "12px",
                  "height": "12px",
                  "borderColor": "#6486E3",
                  "borderWidth": "2px"
                },
                {
                  "type": "filler"
                }
              ],
              "flex": 0
            },
            {
              "type": "text",
              "text": "Star!!",
              "gravity": "center",
              "flex": 4,
              "size": "sm"
            }
          ],
          "spacing": "lg",
          "cornerRadius": "30px"
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "button",
          "style": "primary",
          "action": {
            "type": "message",
            "label": "投げ銭する！",
            "text": "send"
          }
        }
      ]
    }
  }
};

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
  const repToken = jsonBody.events[0].replyToken;
  const repText = jsonBody.events[0].message.text;
  let hwid = '';
  if(jsonBody.events[0].type === 'beacon') {
    hwid = jsonBody.events[0].beacon.hwid;
  }

  // テスト送信
  if (repToken == '00000000000000000000000000000000') {
    context.succeed(createResponse(200, 'Completed successfully !!'));
    console.log("Success: Response completed successfully !!");
  } else {

    let resText = '';
    const client = new line.Client({
      channelAccessToken: LINE_TOKEN
    });

    if(repText === 'send') {
      resText = '投げ銭をしました';
      return client.replyMessage(repToken, {
        type: 'text',
        text: resText
      })
      .then(() => {
        context.succeed(createResponse(200, 'Completed successfully !!'));
      });
    } else {
      resText = `Beacon : ${hwid}`;

      console.log(`Replay Message : ${resText}`);
      console.log({message});
    }

    return client.replyMessage(repToken, message)
      .then(() => {
        context.succeed(createResponse(200, 'Completed successfully !!'));
      });
  }
}
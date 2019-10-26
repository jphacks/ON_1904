const line = require('@line/bot-sdk');
const fs = require('fs');

const client = new line.Client({
  channelAccessToken: 'nsd+2su2ajyD0DCbsMtggkZfsi2/JaXirfSwI4WWtUF0vg25CE1Jy27FstR7sSE0aqMhQ22Kk4w3MCCo6EzzCfgbEHBsU4boPCfCl7RK4Vu9fUPaHeGQUT4XOdsf/UO36OVWTExp/f+QHsJWvjJdyQdB04t89/1O/w1cDnyilFU='
});

const richmenu = {
  "size":{
      "width":2500,
      "height":1686
  },
  "selected":true,
  "name":"Controller",
  "chatBarText":"Controller",
  "areas":[
      {
        "bounds":{
            "x":0,
            "y":0,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"start"
        }
      },
      {
        "bounds":{
            "x":0,
            "y":843,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"stop"
        }
      },
      {
        "bounds":{
            "x":833,
            "y":0,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"next"
        }
      },
      {
        "bounds":{
            "x":833,
            "y":843,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"setlist"
        }
      },
      {
        "bounds":{
            "x":1666,
            "y":0,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"hwid"
        }
      },
      {
        "bounds":{
            "x":1666,
            "y":843,
            "width":833,
            "height":843
        },
        "action":{
            "type":"message",
            "text":"profile"
        }
      }
  ]
};

client.createRichMenu(richmenu)
  .then((richMenuId) => {
    client.setRichMenuImage(richMenuId, fs.createReadStream('../../../icons/performer/rich_menu.png'))
      .then(() => {
        client.setDefaultRichMenu(richMenuId);
      });
  });

client.getRichMenuList()
  .then((richmenus) => {
    richmenus.forEach((richmenu) => console.log(richmenu));
  });
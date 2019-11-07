import { Client, MessageAPIResponseBase, TextMessage } from '@line/bot-sdk';

const LINE_TOKEN = process.env.ACCESS_TOKEN;

/**
 * Reply TokenをもとにLINEにリプライを送ります
 * @param repToken Reply Token
 * @param resStr メッセージの本文
 */
const replyLine = (repToken: string, resStr: string): Promise<MessageAPIResponseBase> => {
  const client = new Client({
    channelAccessToken: LINE_TOKEN,
  });

  const message: TextMessage = {
    type: 'text',
    text: resStr,
  };

  return client.replyMessage(repToken, message);
};

export default {
  replyLine,
};

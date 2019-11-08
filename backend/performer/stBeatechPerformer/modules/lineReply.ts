import { Client, TextMessage } from '@line/bot-sdk';

const LINE_TOKEN = process.env.ACCESS_TOKEN;

/**
 * Reply TokenをもとにLINEにリプライを送ります
 * @param repToken Reply Token
 * @param resStr メッセージの本文
 */
const replyLine = async (repToken: string, resStr: string): Promise<void> => {
  const client = new Client({
    channelAccessToken: LINE_TOKEN,
  });

  const message: TextMessage = {
    type: 'text',
    text: resStr,
  };

  try {
    await client.replyMessage(repToken, message);
  } catch (err) {
    console.log(`LINE API POST Filed : ${err}`);
  }
};

export default {
  replyLine,
};

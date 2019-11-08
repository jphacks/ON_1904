import { Client } from '@line/bot-sdk';
import { Readable } from 'stream';

const LINE_TOKEN = process.env.ACCESS_TOKEN;

const getLineImage = async (messageId: string): Promise<Readable> => {
  const client = new Client({
    channelAccessToken: LINE_TOKEN,
  });

  const result = await client.getMessageContent(messageId);
  return result;
};

export default {
  getLineImage,
};

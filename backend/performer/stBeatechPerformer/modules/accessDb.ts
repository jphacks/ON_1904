import { UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import dynamoDb from './aws/dynamoDb';

const tableName = 'stBeatechPerformer';

/**
 * プレイリストを更新する
 * @param userId
 * @param songs
 */
const updatePlaylist = async (userId: string, songs: Array<string>): Promise<void> => {
  console.log('updateSongs entered.');

  const songAttributeValues = songs.map((song) => {
    const result = {
      N: song,
    };
    return result;
  });

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
    UpdateExpression: 'set songs = :s',
    ExpressionAttributeValues: {
      ':s': {
        L: songAttributeValues,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  await dynamoDb.update(params);
};

/**
 * ライブ状態を更新
 * @param userId
 * @param isPerformed
 */
const updateIsPerformed = async (userId: string, isPerformed: boolean): Promise<void> => {
  console.log('updateIsPerformed entered.');

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
    UpdateExpression: 'set isPerformed = :p',
    ExpressionAttributeValues: {
      ':p': {
        B: isPerformed,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  await dynamoDb.update(params);
};

/**
 * トラックNoを更新
 * @param userId
 * @param trackNo
 */
const updateTrackNo = async (userId: string, trackNo: number): Promise<void> => {
  console.log('updateTrackNo entered.');

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
    UpdateExpression: 'set trackNo = :t',
    ExpressionAttributeValues: {
      ':t': {
        N: String(trackNo),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  await dynamoDb.update(params);
};

/**
 * トラックNoをインクリメント
 * @param userId
 */
const incrementTrackNo = async (userId: string): Promise<void> => {
  console.log('incrementTrackNo entered.');

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
    UpdateExpression: 'set trackNo = trackNo + :t',
    ExpressionAttributeValues: {
      ':t': {
        N: '1',
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  await dynamoDb.update(params);
};

export default {
  updatePlaylist,
  updateIsPerformed,
  updateTrackNo,
  incrementTrackNo,
};

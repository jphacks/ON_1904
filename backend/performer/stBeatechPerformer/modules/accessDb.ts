import {
  UpdateItemInput,
  GetItemInput,
  GetItemOutput,
} from 'aws-sdk/clients/dynamodb';

import dynamoDb from './aws/dynamoDb';

const tableName = 'stBeatechPerformer';

const getUserById = async (userId: string): Promise<GetItemOutput> => {
  console.log(`Started get user by userId(${userId}) from table(${tableName}).`);
  const params: GetItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
  };
  return dynamoDb.get(params);
};

/**
 * プレイリストを更新する
 * @param userId
 * @param songs
 */
const updatePlaylist = async (userId: string, songs: Array<string>): Promise<void> => {
  console.log('updateSongs entered.');

  const songAttributeValues = songs.map((song) => {
    const result = {
      S: song,
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
  dynamoDb.update(params);
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
        BOOL: isPerformed,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  dynamoDb.update(params);
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
  dynamoDb.update(params);
};

const updatePerformerState = async (userId: string, state: number): Promise<void> => {
  console.log('updatePerformerState entered.');

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: {
        S: userId,
      },
    },
    UpdateExpression: 'set performerState = :s',
    ExpressionAttributeValues: {
      ':s': {
        N: String(state),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  dynamoDb.update(params);
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
  dynamoDb.update(params);
};

export default {
  getUserById,
  updatePlaylist,
  updateIsPerformed,
  updateTrackNo,
  updatePerformerState,
  incrementTrackNo,
};

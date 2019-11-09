import {
  UpdateItemInput, UpdateItemOutput,
} from 'aws-sdk/clients/dynamodb';

import dynamoDb from './aws/dynamoDb';

const tableName = 'stBeatechAPI';

/**
 * プレイリストを更新する
 * @param userId
 * @param songs
 */
const updateTime = async (timeStamp: string): Promise<void> => {
  console.log('updateTime entered.');

  const params: UpdateItemInput = {
    TableName: tableName,
    Key: {
      hogeId: {
        S: '1',
      },
    },
    UpdateExpression: 'set time = :s',
    ExpressionAttributeValues: {
      ':s': {
        S: timeStamp,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };
  dynamoDb.update(params)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};


export default {
  updateTime,
};

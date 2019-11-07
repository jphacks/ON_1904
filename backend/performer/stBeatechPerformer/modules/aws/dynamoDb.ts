import aws from 'aws-sdk';
import { UpdateItemInput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';

const dynamoClient = new aws.DynamoDB.DocumentClient({ region: 'us-west-2' });

/**
 * DynamoDBに対してupdateを行います
 * @param params updateする内容
 */
const update = (params: UpdateItemInput): Promise<UpdateItemOutput> => {
  const result = new Promise((resolve, reject) => {
    dynamoClient.update(params, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
  return result;
};

export default {
  update,
};

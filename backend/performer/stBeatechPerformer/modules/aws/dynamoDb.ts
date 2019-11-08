import aws from 'aws-sdk';
import {
  UpdateItemInput,
  UpdateItemOutput,
  GetItemInput,
  GetItemOutput,
  QueryInput,
  QueryOutput,
} from 'aws-sdk/clients/dynamodb';

aws.config.update({ region: 'us-west-2' });

const dynamo = new aws.DynamoDB();

/**
 * DynamoDBに対してgetを行います
 * @param params getする内容
 */
const get = async (params: GetItemInput): Promise<GetItemOutput> => {
  const result = await dynamo.getItem(params).promise();
  return result;
};

/**
 * DynamoDBに対してsearchを行います
 * @param params searchする内容
 */
const search = async (params: QueryInput): Promise<QueryOutput> => {
  const result = await dynamo.query(params).promise();
  return result;
};

/**
 * DynamoDBに対してupdateを行います
 * @param params updateする内容
 */
const update = async (params: UpdateItemInput): Promise<UpdateItemOutput> => {
  const result = await dynamo.updateItem(params).promise();
  return result;
};

export default {
  get,
  search,
  update,
};

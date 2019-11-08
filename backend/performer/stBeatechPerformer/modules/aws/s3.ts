import aws from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

aws.config.update({ region: 'us-west-2' });

const s3 = new aws.S3();

const bucketName = 'st-beatech';

const saveImage = async (data: Array<Buffer>, userId: string): Promise<void> => {
  const params: PutObjectRequest = {
    Bucket: bucketName,
    Key: `${userId}.png`,
    Body: Buffer.concat(data),
    ACL: 'public-read',
  };
  await s3.putObject(params).promise();
};

export default {
  saveImage,
};

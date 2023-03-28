import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  HeadBucketCommand
} from "@aws-sdk/client-s3";
import { AppEnvironment } from "@lib/backend-shared";

// Set the AWS Region.
const REGION = "us-east-1"; // e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

// https://www.npmjs.com/package/s3-upload-stream

export class AwsS3Service {
  static readonly s3Client = s3Client;

  static readonly Bucket = AppEnvironment.AWS.S3;

  // create

  static async createBucket(Bucket: string) {
    const data = await s3Client.send(new CreateBucketCommand({ Bucket }));
    console.log({ data });
    console.log("Successfully created a bucket called:", data.Location);
    return data; // For unit tests.
  }

  static async createObject(params: {
    Bucket: string, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
    Body: any, // The content of the object. For example, 'Hello world!".
  }) {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
      params.Key +
      " and uploaded it to " +
      params.Bucket +
      "/" +
      params.Key
    );
    return results;
  }

  // get

  static async getObject(params: {
    Bucket: string // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
  }) {
    const results = await s3Client.send(new GetObjectCommand(params));
    console.log(
      "Successfully fetched " +
      params.Key +
      " and uploaded it to " +
      params.Bucket +
      "/" +
      params.Key
    );
    return results; // For unit tests.
  }

  // delete

  static async deleteBucket(Bucket: string) {
    const data = await s3Client.send(new DeleteBucketCommand({ Bucket }));
    console.log(data);
    return data; // For unit tests.
  }

  static async deleteObject(params: {
    Bucket: string, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
  }) {
    const results = await s3Client.send(new DeleteObjectCommand(params));
    console.log(
      "Successfully deleted " +
      params.Key +
      " from bucket " +
      params.Bucket
    );
    
    return results;
  }


  static async bucketExists(Bucket: string): Promise<boolean> {
    try {
      const response = await s3Client.send(new HeadBucketCommand({ Bucket }));
      return true;
    }
    catch {
      return false;
    }
  }
}
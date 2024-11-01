// this lamdba function is used for save the video to the S3 and the metadata to DB

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";   
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; 
import axios from 'axios';

// Initialize the AWS S3 and DynamoDB clients
const s3 = new S3Client({});
const dynamoDB = new DynamoDBClient({});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2)); // Log the incoming event
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    console.log('Parsed body:', body); // Log the parsed body

    const { twitterId, videoUrl, avatar, name, full_text, originalTweet } = body;

    // Validate required fields
    if (!twitterId || !videoUrl) {
      throw new Error('Missing required fields: twitterId and videoUrl');
    }

    // Download the video file
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Upload to S3
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `${twitterId}.mp4`,
      Body: videoBuffer,
      ContentType: 'video/mp4',
    };

    try {
      const s3UploadCommand = new PutObjectCommand(s3Params);
      await s3.send(s3UploadCommand);
      console.log(`Uploaded video to S3: https://${BUCKET_NAME}.s3.amazonaws.com/${twitterId}.mp4`);
    } catch (s3Error) {
      console.error('Error uploading to S3:', s3Error);
      throw new Error('Failed to upload video to S3');
    }

    // Save metadata to DynamoDB
    const dbParams = {
      TableName: TABLE_NAME,
      Item: {
        fileID: { S: twitterId || 'unknown' }, // Use object notation for DynamoDB
        fileName: { S: `${twitterId}.mp4` },
        fileUrl: { S: `https://${BUCKET_NAME}.s3.amazonaws.com/${twitterId}.mp4` },
        contentType: { S: 'video/mp4' },
        uploadDate: { S: new Date().toISOString() },
        twitterAvatar: { S: avatar || 'unknown' },
        twitterAuthor: { S: name || 'unknown' },
        prompt: { S: full_text || 'No prompt available' },
        originalTweet: { S: originalTweet || 'No original tweet available' },
      },
    };

    try {
      await dynamoDB.send(new PutItemCommand(dbParams));
      console.log(`Metadata saved to DynamoDB for tweet ID ${twitterId}`);
    } catch (dbError) {
      console.error('Error saving to DynamoDB:', dbError);
      throw new Error('Failed to save metadata to DynamoDB');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video and metadata uploaded successfully.' }),
    };

  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process video and metadata', error: error.message }),
    };
  }
};

// this lamdba link withe fileupload.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; 
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from 'crypto';

// Initialize the S3 and DynamoDB clients with the hardcoded region
const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

const TABLE_NAME = process.env.TABLE_NAME;  // DynamoDB table name

export const handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;  // Keep bucket name as an environment variable
    const body = JSON.parse(event.body);

    const fileName = body.fileName;
    const fileContent = Buffer.from(body.fileContent, 'base64');
    const contentType = body.contentType;
    const fileSize = Buffer.byteLength(fileContent);
    const uploadDate = new Date().toISOString();

    const s3Params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: contentType,
    };

    try {
        // Upload the file to S3
        const putObjectCommand = new PutObjectCommand(s3Params);
        await s3Client.send(putObjectCommand);

        // Construct the S3 object URL
        const fileUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${fileName}`;
        console.log(`File URL: ${fileUrl}`);

        // Generate a unique file ID
        const uniqueFileId = crypto.randomUUID();

        // Prepare the item to store in DynamoDB
        const dynamoParams = {
            TableName: TABLE_NAME,
            Item: {
                fileID: { S: uniqueFileId },  // Use 'fileID' here (note the capitalization)
                fileName: { S: fileName },
                fileSize: { N: fileSize.toString() },
                contentType: { S: contentType },
                uploadDate: { S: uploadDate },
                fileUrl: { S: fileUrl },  // Add the file URL here
            },
        };

        // Log the item being sent to DynamoDB
        console.log('Item to be inserted:', dynamoParams.Item);

        // Store metadata in DynamoDB
        try {
            const putItemCommand = new PutItemCommand(dynamoParams);
            await dynamoDBClient.send(putItemCommand);
        } catch (dynamoError) {
            console.error('Error inserting item into DynamoDB:', dynamoError);
            throw new Error('Could not insert item into DynamoDB');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded and metadata stored successfully!', fileName, fileUrl }),
        };
    } catch (error) {
        console.error('Error uploading file or storing metadata:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Could not upload file or store metadata',
                details: error.message,
            }),
        };
    }
};

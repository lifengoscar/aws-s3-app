// this lamdba link with fetchdata.js
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' }); // Ensure the region is correct

// Your S3 bucket name (you may want to use an environment variable for this)
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;  // Replace with your S3 bucket name

// Helper function to map DynamoDB attributes to plain JSON
const mapDynamoDBItem = (item) => {
    return {
        fileID: item.fileID?.S || "", 
        fileName: item.fileName?.S || "",
        fileSize: item.fileSize?.N || "0", 
        contentType: item.contentType?.S || "",
        uploadDate: item.uploadDate?.S || "",
        fileUrl: `https://${S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${item.fileName?.S || ""}`, // Generate the S3 URL
        twitterAuthor: item.twitterAuthor?.S || "", // Include twitterAuthor
        prompt: item.prompt?.S || "", // Include prompt
    };
};

export const handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME, // Use environment variable for table name
    };

    try {
        // Scan the DynamoDB table to get all items
        const command = new ScanCommand(params);
        const data = await client.send(command);

        // Map the DynamoDB items to a plain JSON structure
        const files = data.Items.map(mapDynamoDBItem);

        // Return the files as the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  // Modify as needed
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(files), 
        };
    } catch (error) {
        console.error("Error fetching files:", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',  
            },
            body: JSON.stringify({ error: 'Could not fetch files', details: error.message }), // Include error details for debugging
        };
    }
};

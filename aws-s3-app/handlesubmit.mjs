// this lamdba link with app.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);

export const handler = async (event) => {
  console.log(event.body, typeof event.body)
  const requestBody = JSON.parse(event.body);
  console.log(requestBody, typeof requestBody)
  const name = requestBody["name"]
  const email = requestBody["email"]
 
console.log(name,email)
  // Construct the parameters for the DynamoDB put operation
  const params = {
    TableName: 'FormSubmissions',
    Item: {
      email: email,
      name: name,
      submittedAt: new Date().toISOString()
    }
  };

  try {
    // Save the data to DynamoDB
    await dynamo.send(new PutCommand(params));
    // Return a successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'You have successfully subscribed!' })
    };
  } catch (error) {
    // Handle errors
    console.error('Error saving data to DynamoDB:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Error saving data', error: error.message })
    };
  }
};

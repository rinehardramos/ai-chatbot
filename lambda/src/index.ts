import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
  ConversationRole,
} from "@aws-sdk/client-bedrock-runtime";

interface LambdaRequest {
  message: string;
  body: string;
}

interface LambdaResponse {
  response: string;
  timestamp: string;
}

interface LambdaError {
  error: string;
  message: string;
}

export const handler = async (
  event: { body?: string },
  context: any
): Promise<{
  statusCode: number;
  headers: { 'Content-Type': string };
  body: string;
}> => {
  try {
    // Parse incoming request body
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const request: LambdaRequest = requestBody || {};

    // Initialize Bedrock Runtime client
    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    // Configure the model and prompt
    const modelId = "amazon.nova-lite-v1:0";
    // const inputText = request.message || "Please provide a prompt in the request body";

    // Configure the request with inference parameters
    // const requestConfig: InvokeModelCommandInput = {
    //     body: JSON.stringify({
    //         messages: [{
    //                 role: ConversationRole.USER,
    //                 content: [{ text: request.message }]
    //             }]
    //     }),
    //     contentType: "application/json",
    //     accept: "application/json",
    //     modelId: modelId
    // };

    const input = {
        body: JSON.stringify({
            inputText: "Please recommend books with a theme similar to the movie 'Inception'."
        }),
        contentType: "application/json",
        accept: "application/json",
        modelId: "amazon.titan-embed-text-v2:0"
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    // Send the request and get response
    // const response: InvokeModelCommandOutput = await client.send(new InvokeModelCommand(requestConfig));

    const responseBody = JSON.parse(response.body.toString());
    const modelResponse = responseBody.completions[0]?.data?.text || '';
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: modelResponse,
        timestamp: new Date().toISOString()
      } as LambdaResponse)
    };
  } catch (error) {
    console.error('Error invoking model:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as LambdaError)
    };
  }
};
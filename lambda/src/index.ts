import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
  ConversationRole,
  ConverseCommand,
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
    // const request: LambdaRequest = requestBody || {};

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

    const inputText = "Describe the purpose of a 'hello world' program in one line.";
    const message = {
        content: [{ text: inputText }],
        role: ConversationRole.USER,
    };

    // const input = {
    //     body: JSON.stringify({
    //         inputText: "Please recommend books with a theme similar to the movie 'Inception'."
    //     }),
    //     contentType: "application/json",
    //     accept: "application/json",
    //     modelId: "amazon.titan-embed-text-v2:0"
    // };

    const request = {
        modelId,
        messages: [message],
        inferenceConfig: {
            maxTokens: 500, // The maximum response length
            temperature: 0.5, // Using temperature for randomness control
            //topP: 0.9,        // Alternative: use topP instead of temperature
        },
    };

    let bedrock_response;

    try {
        const response = await client.send(new ConverseCommand(request));
        if (response && response.output && response.output.message) {
            const message = response.output.message;
            if (message.content && message.content.length > 0) {
                bedrock_response = message.content[0].text;
            } else {
                console.log('No content found in response');
                bedrock_response = "No content found in response"
            }
        } else {
            console.log('Invalid response structure');
        }
        // console.log(response.output.message.content[0].text);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${error.message}`);
        } else {
            throw error;
        }
    }

    // const command = new InvokeModelCommand(input);
    // const response = await client.send(command);

    // Send the request and get response
    // const response: InvokeModelCommandOutput = await client.send(new InvokeModelCommand(requestConfig));

    // const responseBody = JSON.parse(response.body.toString());
    // const modelResponse = responseBody.completions[0]?.data?.text || '';
    // // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: bedrock_response,
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
import {
  BedrockRuntimeClient,
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
    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    const modelId = "amazon.nova-lite-v1:0";

    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    const messageContent = requestBody?.message ?? 
            (typeof requestBody === 'string' ? requestBody : 
            "No message content provided");
  
    const message = {
        content: [{ text: messageContent }],
        role: ConversationRole.USER,
    };

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
    } catch (error) {
        if (error instanceof Error) {
            console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${error.message}`);
        } else {
            throw error;
        }
    }

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
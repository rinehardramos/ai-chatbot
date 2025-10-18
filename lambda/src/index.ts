import { APIGatewayEventRequestContext, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

// Define types for request and response bodies
interface GetRequest {
    params?: Record<string, string | undefined>;
    query?: Record<string, string | undefined>;
}
interface PostRequest {
    body: Record<string, any>;
}

export const handler = async (
    event: APIGatewayProxyEventV2,
    context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResultV2> => {
    try {
        // Send immediate response for testing
        const immediateResponse: APIGatewayProxyResultV2 = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Test response received',
                timestamp: new Date().toISOString(),
                eventMethod: event.requestContext.http.method
            })
        };

        // Log the event for debugging
        console.log('Event received:', JSON.stringify(event, null, 2));

        // Return the immediate response
        return immediateResponse;
    } catch (error) {
        console.error('Error handling request:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};
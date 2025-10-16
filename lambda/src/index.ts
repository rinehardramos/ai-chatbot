import { APIGatewayEventRequestContext, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

// Define types for request and response bodies
interface GetRequest {
    params?: Record<string, string | undefined>;  // Allow undefined values
    query?: Record<string, string | undefined>;   // Allow undefined values
}

interface PostRequest {
    body: Record<string, any>;
}

// Define the handler function with proper TypeScript types
export const handler = async (
    event: APIGatewayProxyEventV2,
    context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResultV2> => {
    try {
        // Extract HTTP method from event
        const httpMethod = event.requestContext.http.method;

        // Handle GET requests
        if (httpMethod === "GET") {
            const params: GetRequest = {
                params: event.pathParameters || {},
                query: event.queryStringParameters || {}
            };

            // Process GET logic here
            const response: APIGatewayProxyResultV2 = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'GET request received',
                    params: params
                })
            };

            return response;
        }

        // Handle POST requests
        else if (httpMethod === "POST") {
            // Parse request body
            const body: PostRequest = JSON.parse(event.body || '{}');

            // Process POST logic here
            const response: APIGatewayProxyResultV2 = {
                statusCode: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'POST request received',
                    data: body
                })
            };

            return response;
        }

        // Return error for unsupported methods
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Method Not Allowed'
            })
        };
    } catch (error) {
        console.error('Error handling request:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Internal Server Error'
            })
        };
    }
};
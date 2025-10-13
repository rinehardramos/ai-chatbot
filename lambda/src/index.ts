import { LambdaEnvironment, APIGatewayProxyEvent, APIGatewayProxyResult } from './types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const environment = process.env.GITHUB_ENVIRONMENT || 'dev';
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda',
            environment
        })
    };
};
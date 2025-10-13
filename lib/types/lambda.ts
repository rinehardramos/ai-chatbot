export interface LambdaEnvironment {
    GITHUB_ENVIRONMENT: string;
}

export interface APIGatewayProxyEvent {
    body: string;
    headers: { [key: string]: string };
    httpMethod: string;
    path: string;
    queryStringParameters: { [key: string]: string };
}

export interface APIGatewayProxyResult {
    statusCode: number;
    body: string;
}

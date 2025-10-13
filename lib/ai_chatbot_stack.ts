import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class AiChatbotStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create Lambda execution role
        const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            description: 'Execution role for chatbot Lambda'
        });

        // Add necessary permissions
        lambdaRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                'service-role/AWSLambdaBasicExecutionRole'
            )
        );

        // Create Lambda function
        const lambdaFunction = new lambda.Function(this, 'ChatbotLambda', {
            functionName: `${cdk.Aws.REGION}-chatbot-lambda`,
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'),
            role: lambdaRole,
            environment: {
                GITHUB_ENVIRONMENT: cdk.Aws.REGION
            }
        });

        // Add CloudWatch metrics
        new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Error',
            dimensionsMap: {
                FunctionName: lambdaFunction.functionName
            }
        });
    }
}
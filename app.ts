// app.ts
import * as cdk from 'aws-cdk-lib';
import { AiChatbotStack } from './lib/ai_chatbot_stack';

const app = new cdk.App();
new AiChatbotStack(app, 'AiChatbotStack');

app.synth();
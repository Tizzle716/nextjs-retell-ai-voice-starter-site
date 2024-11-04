import OpenAI from 'openai';

export const togetherAI = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY!,
  baseURL: 'https://api.together.xyz/v1',
});

export const TOGETHER_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'; 
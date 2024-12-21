// import { TogetherAIClient } from '@together-ai/sdk';

// const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// if (!TOGETHER_API_KEY) {
//   throw new Error('TOGETHER_API_KEY is not set in environment variables');
// }

// export const togetherAIClient = new TogetherAIClient({
//   apiKey: TOGETHER_API_KEY,
// });

// export async function generateChatCompletion(messages: any[]) {
//   try {
//     const response = await togetherAIClient.chat.create({
//       model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
//       messages,
//       temperature: 0.7,
//       max_tokens: 1024,
//     });
    
//     return response;
//   } catch (error) {
//     console.error('Error generating chat completion:', error);
//     throw error;
//   }
// }

// Placeholder exports to prevent import errors
export const togetherAIClient = null;
export const TOGETHER_MODEL = '';
export const togetherAI = {
  chat: {
    completions: {
      create: async () => { throw new Error('Together AI is disabled'); }
    }
  }
};

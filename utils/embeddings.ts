// utils/embeddings.ts
export async function generateEmbeddings(text: string): Promise<number[]> {
    const response = await fetch('https://api.together.xyz/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'togethercomputer/m2-bert-80M-8k-retrieval',
        input: text
      })
    });
  
    const data = await response.json();
    return data.data[0].embedding;
  }
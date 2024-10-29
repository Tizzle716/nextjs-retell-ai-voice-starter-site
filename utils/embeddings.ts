// utils/embeddings.ts
interface TogetherEmbeddingResponse {
  data: {
    object: 'embedding';
    embedding: number[];
    index: number;
  }[];
  model: string;
  object: 'list';
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return new Array(1536).fill(0);
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'togethercomputer/m2-bert-80M-8k-retrieval',
        input: text,
        dimensions: 1536
      })
    });

    if (!response.ok) {
      console.error('Together API response:', await response.text());
      return new Array(1536).fill(0);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;

    if (embedding.length !== 1536) {
      console.error('Invalid embedding dimension');
      return new Array(1536).fill(0);
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return new Array(1536).fill(0);
  }
}
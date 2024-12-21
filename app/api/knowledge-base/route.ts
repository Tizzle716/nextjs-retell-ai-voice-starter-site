import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const knowledgeBaseData = new FormData();

    // Copy all form data to a new FormData object
    for (const [key, value] of formData.entries()) {
      if (key === 'knowledge_base_urls') {
        // Parse the JSON string back to an array
        const urls = JSON.parse(value as string);
        urls.forEach((url: string) => {
          knowledgeBaseData.append('knowledge_base_urls[]', url);
        });
      } else if (key === 'knowledge_base_files') {
        // Handle files
        knowledgeBaseData.append('knowledge_base_files[]', value);
      } else {
        knowledgeBaseData.append(key, value);
      }
    }

    const response = await fetch('https://api.retellai.com/create-knowledge-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
      },
      body: knowledgeBaseData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create knowledge base');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base' },
      { status: 500 }
    );
  }
}

// app/types/document.ts
export interface Document {
    id: string;
    title: string;
    content: string;
    category: 'Construction' | 'Renovation' | 'Energies' | 'Estate' | 'Closing';
    subcategory: string;
    file_type: 'PDF' | 'transcription';
    keywords: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface DocumentWithVector extends Document {
    embedding_vector: number[];
  }
import { google, type GoogleEmbeddingModelOptions } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';

const embeddingModel = google.embedding('gemini-embedding-001');

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      } satisfies GoogleEmbeddingModelOptions,
    },
  });
  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      } satisfies GoogleEmbeddingModelOptions,
    },
  });
  return embeddings;
}

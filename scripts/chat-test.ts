import { config } from 'dotenv';
config({ path: '.env' });

import { neon } from '@neondatabase/serverless';
import { generateEmbedding } from '../src/lib/ai/embed.ts';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { cosineSimilarity } from 'ai';

const sql = neon(process.env.DATABASE_URL!);

const question = 'What are the top complaints about the app?';

const queryEmb = await generateEmbedding(question);

const rows = await sql`
  SELECT f.text, f.rating, e.embedding
  FROM feedback_embeddings e
  JOIN feedback_items f ON f.id = e.feedback_item_id
`;

const parsed = rows.map((r: any) => ({
  text: r.text,
  rating: r.rating,
  embedding:
    typeof r.embedding === 'string' ? JSON.parse(r.embedding) : r.embedding,
}));

const scored = parsed
  .map((r) => ({ ...r, score: cosineSimilarity(queryEmb, r.embedding) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

const context = scored.map((r) => `[Rating ${r.rating}] ${r.text}`).join('\n');

const prompt = `You are a customer feedback analyst. Answer the question based only on the feedback evidence below.

Feedback:
${context}

Question: ${question}`;

console.log(`\nQuestion: ${question}\n`);
console.log('--- Evidence ---');
scored.forEach((r) =>
  console.log(`  ${(r.score * 100).toFixed(0)}%  ☆${r.rating}  ${r.text}`),
);
console.log('--- Response ---\n');

const { textStream } = streamText({
  model: google('gemini-2.5-flash'),
  prompt,
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
console.log('\n');

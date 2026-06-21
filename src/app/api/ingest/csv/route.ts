import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db/drizzle';
import { feedbackItems, feedbackEmbeddings } from '@/db/schema';
import { parseCsv } from '@/lib/ingestion/csv';
import { generateEmbeddings } from '@/lib/ai/embed';

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json(
      { error: 'No active organization' },
      { status: 400 },
    );
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'No CSV file provided' },
      { status: 400 },
    );
  }

  const content = await file.text();
  const parsed = parseCsv(content);

  if (parsed.rows.length === 0) {
    return NextResponse.json({ inserted: 0, errors: parsed.errors });
  }

  try {
    const insertedFeedbackItems = await db
      .insert(feedbackItems)
      .values(
        parsed.rows.map((row) => ({
          id: crypto.randomUUID(),
          organizationId,
          source: 'csv',
          sourceItemId: row.sourceItemId,
          text: row.text,
          rating: row.rating,
          authorName: row.authorName,
          createdAt: row.createdAt,
        })),
      )
      .returning();

    const texts = insertedFeedbackItems.map((item) => item.text);
    const embeddingVectors = await generateEmbeddings(texts);

    await db.insert(feedbackEmbeddings).values(
      insertedFeedbackItems.map((item, i) => ({
        id: crypto.randomUUID(),
        feedbackItemId: item.id,
        embedding: embeddingVectors[i],
        modelName: 'gemini-embedding-001',
      })),
    );

    return NextResponse.json({
      inserted: insertedFeedbackItems.length,
      errors: parsed.errors,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { inserted: 0, errors: [{ row: -1, message }] },
      { status: 500 },
    );
  }
}

import Papa from 'papaparse';

interface CsvInputRow {
  text?: string;
  rating?: string;
  author_name?: string;
  source_item_id?: string;
  created_at?: string;
}

export interface NormalizedFeedback {
  text: string;
  rating: number | null;
  authorName: string | null;
  sourceItemId: string | null;
  createdAt: Date;
}

export interface ParseResult {
  rows: NormalizedFeedback[];
  errors: { row: number; message: string }[];
}

export function parseCsv(content: string): ParseResult {
  const { data, errors: parseErrors } = Papa.parse<CsvInputRow>(content, {
    header: true,
    skipEmptyLines: true,
  });

  const results: ParseResult = { rows: [], errors: [] };

  for (const err of parseErrors) {
    results.errors.push({ row: err.row ?? -1, message: err.message });
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (!row.text || row.text.trim().length === 0) {
      results.errors.push({ row: i + 1, message: 'text is required' });
      continue;
    }

    let rating: number | null = null;
    if (row.rating !== undefined && row.rating !== '') {
      const parsed = parseInt(row.rating, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 5) {
        results.errors.push({ row: i + 1, message: 'rating must be a number between 1 and 5' });
        continue;
      }
      rating = parsed;
    }

    let createdAt = new Date();
    if (row.created_at) {
      const parsed = new Date(row.created_at);
      if (!isNaN(parsed.getTime())) {
        createdAt = parsed;
      } else {
        results.errors.push({ row: i + 1, message: `invalid date: "${row.created_at}"` });
        continue;
      }
    }

    results.rows.push({
      text: row.text,
      rating,
      authorName: row.author_name ?? null,
      sourceItemId: row.source_item_id ?? null,
      createdAt,
    });
  }

  return results;
}

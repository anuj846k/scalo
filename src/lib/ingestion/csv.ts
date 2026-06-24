import Papa from 'papaparse';

interface CsvInputRow {
  text?: string;
  rating?: string;
  author_name?: string;
  source_item_id?: string;
  created_at?: string;
  [key: string]: string | undefined;
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

const SCHEMA_FIELDS = [
  'text',
  'rating',
  'author_name',
  'source_item_id',
  'created_at',
] as const;

export function detectColumnMap(headers: string[]): Record<string, string> {
  const hints: Record<string, string[]> = {
    text: [
      'text',
      'review',
      'comment',
      'feedback',
      'message',
      'body',
      'content',
    ],
    rating: ['rating', 'score', 'stars', 'rate', 'rank'],
    author_name: [
      'author',
      'name',
      'user',
      'customer',
      'reviewer',
      'author_name',
      'author name',
    ],
    source_item_id: [
      'id',
      'source_id',
      'item_id',
      'external_id',
      'source_item_id',
      'source item id',
    ],
    created_at: [
      'date',
      'created',
      'timestamp',
      'created_at',
      'created at',
      'datetime',
    ],
  };

  const map: Record<string, string> = {};
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const field of SCHEMA_FIELDS) {
    const idx = lowerHeaders.findIndex(
      (h) =>
        hints[field].includes(h) ||
        hints[field].some((hint) => h.includes(hint)),
    );
    if (idx !== -1) {
      map[field] = headers[idx];
    }
  }

  return map;
}

export function parseCsv(
  content: string,
  columnMap?: Record<string, string>,
): ParseResult {
  const { data, errors: parseErrors } = Papa.parse<CsvInputRow>(content, {
    header: true,
    skipEmptyLines: true,
  });

  const results: ParseResult = { rows: [], errors: [] };

  for (const err of parseErrors) {
    results.errors.push({ row: err.row ?? -1, message: err.message });
  }

  for (let i = 0; i < data.length; i++) {
    const raw = data[i];

    const row: CsvInputRow = {};
    if (columnMap) {
      for (const [schemaField, csvCol] of Object.entries(columnMap)) {
        row[schemaField] = raw[csvCol];
      }
    } else {
      Object.assign(row, raw);
    }

    if (!row.text || row.text.trim().length === 0) {
      results.errors.push({ row: i + 1, message: 'text is required' });
      continue;
    }

    let rating: number | null = null;
    if (row.rating !== undefined && row.rating !== '') {
      const parsed = parseInt(row.rating, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 5) {
        results.errors.push({
          row: i + 1,
          message: 'rating must be a number between 1 and 5',
        });
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
        results.errors.push({
          row: i + 1,
          message: `invalid date: "${row.created_at}"`,
        });
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

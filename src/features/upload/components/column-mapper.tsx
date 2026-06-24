'use client';

import { Label } from '@/components/ui/label';

interface ColumnMapperProps {
  headers: string[];
  mapping: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
}

const SCHEMA_FIELDS = [
  { field: 'text', label: 'text *', required: true, hint: 'The feedback text' },
  { field: 'rating', label: 'rating', required: false, hint: '1–5 score' },
  {
    field: 'author_name',
    label: 'author_name',
    required: false,
    hint: 'Reviewer name',
  },
  {
    field: 'source_item_id',
    label: 'source_item_id',
    required: false,
    hint: 'Unique ID',
  },
  {
    field: 'created_at',
    label: 'created_at',
    required: false,
    hint: 'Date or timestamp',
  },
];

export function ColumnMapper({
  headers,
  mapping,
  onChange,
}: ColumnMapperProps) {
  const updateMapping = (field: string, value: string) => {
    onChange({ ...mapping, [field]: value });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Column Mapping</p>
      <p className="text-xs text-muted-foreground -mt-2">
        Map your CSV columns to Murmur schema fields. Required fields marked
        with *.
      </p>
      <div className="rounded-lg border divide-y">
        {SCHEMA_FIELDS.map(({ field, label, required }) => (
          <div key={field} className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-32 shrink-0">
              <Label className="text-xs font-mono">{label}</Label>
            </div>
            <select
              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={mapping[field] || ''}
              onChange={(e) => updateMapping(field, e.target.value)}
            >
              {!required && <option value="">— Skip —</option>}
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ColumnMapper } from './column-mapper';
import { detectColumnMap } from '@/lib/ingestion/csv';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = Papa.parse(text, { header: true, preview: 10 });
      const cols = parsed.meta.fields || [];
      setHeaders(cols);
      setPreviewRows(
        (parsed.data as Record<string, string>[]).map((r) =>
          cols.map((c) => r[c] ?? ''),
        ),
      );
      setMapping(detectColumnMap(cols));
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('columnMap', JSON.stringify(mapping));

    try {
      const res = await fetch('/api/ingest/csv', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.inserted > 0 && data.errors?.length === 0) {
        toast.success(`Successfully ingested ${data.inserted} feedback items`, {
          description: 'Embeddings generated and stored.',
        });
      } else if (data.inserted > 0 && data.errors?.length > 0) {
        toast.warning(
          `Ingested ${data.inserted} items with ${data.errors.length} warnings`,
          {
            description: data.errors
              .slice(0, 3)
              .map(
                (e: { row: number; message: string }) =>
                  `Row ${e.row}: ${e.message}`,
              )
              .join('\n'),
          },
        );
      } else {
        toast.error('Upload failed', {
          description: data.errors
            ?.map((e: { row: number; message: string }) => e.message)
            .join('\n'),
        });
      }
    } catch {
      toast.error('Upload failed', { description: 'Network error' });
    } finally {
      setUploading(false);
    }
  };

  const isMapped = mapping.text && mapping.text.trim().length > 0;

  return (
    <div className="h-full grid grid-cols-[3fr_2fr] gap-6 overflow-hidden">
      <div className="flex flex-col min-h-0 space-y-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Upload Feedback CSV</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a CSV file. Map your columns to Scalo&apos;s schema.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/sample.csv" download>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Sample CSV
            </a>
          </Button>
        </div>

        <Card
          className="relative border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors p-6 shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            {file ? (
              <>
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB &middot; {headers.length}{' '}
                    columns
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setHeaders([]);
                    setPreviewRows([]);
                    setMapping({});
                  }}
                >
                  Remove
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-sm">
                    Click to select a CSV file
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    or drag and drop
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {file && headers.length > 0 && (
          <div className="flex flex-col min-h-0">
            <p className="text-sm font-semibold mb-2 shrink-0">
              Preview (first 10 rows)
            </p>
            <div className="rounded-lg border overflow-auto flex-1 min-h-0">
              <table className="w-full text-xs">
                <thead className="sticky top-0">
                  <tr className="bg-muted/50">
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-mono font-medium text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-t">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 truncate max-w-48">
                          {cell || (
                            <span className="text-muted-foreground italic">
                              empty
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {uploading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground shrink-0">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating embeddings...
          </div>
        )}
      </div>

      <div className="flex flex-col min-h-0">
        {file && headers.length > 0 ? (
          <div className="flex flex-col gap-6">
            <ColumnMapper
              headers={headers}
              mapping={mapping}
              onChange={setMapping}
            />

            {isMapped && !uploading && (
              <Button
                className="w-full shrink-0"
                size="lg"
                onClick={handleUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload & Ingest
              </Button>
            )}

            {!isMapped && (
              <p className="text-xs text-destructive text-center shrink-0">
                Please map the &quot;text&quot; field to upload.
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Select a CSV file to see the column mapping.
          </div>
        )}
      </div>
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-all">
      <code>{code}</code>
    </pre>
  );
}

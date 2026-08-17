'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface McpAccessTokenRecord {
  id: string;
  name: string;
  tokenPrefix: string;
  lastUsedAt: string | null;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
}

interface McpAccessTokenResponse {
  tokens: McpAccessTokenRecord[];
}

interface CreatedMcpAccessToken {
  token: string;
  record: McpAccessTokenRecord;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to load MCP keys.');
  return data;
};

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function McpAccessTokens({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data, error, isLoading, mutate } = useSWR<McpAccessTokenResponse>(
    organizationId ? `/api/mcp-tokens?organization=${organizationId}` : null,
    fetcher,
  );
  const [name, setName] = useState('Development');
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [createdToken, setCreatedToken] =
    useState<CreatedMcpAccessToken | null>(null);
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const createToken = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setActionError(null);

    try {
      const response = await fetch('/api/mcp-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Failed to create key.');

      setCreatedToken(result as CreatedMcpAccessToken);
      setName('Development');
      await mutate();
    } catch (createError) {
      setActionError(
        createError instanceof Error
          ? createError.message
          : 'Failed to create key.',
      );
    } finally {
      setCreating(false);
    }
  };

  const revokeToken = async (id: string) => {
    setRevokingId(id);
    setActionError(null);

    try {
      const response = await fetch(`/api/mcp-tokens/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Failed to revoke key.');
      await mutate();
    } catch (revokeError) {
      setActionError(
        revokeError instanceof Error
          ? revokeError.message
          : 'Failed to revoke key.',
      );
    } finally {
      setRevokingId(null);
    }
  };

  const copyToken = async () => {
    if (!createdToken) return;
    await navigator.clipboard.writeText(createdToken.token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">MCP keys</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Personal keys for local MCP clients.
      </p>

      <Separator />

      <form onSubmit={createToken} className="py-5 space-y-3">
        <Label htmlFor="mcp-key-name" className="text-xs font-medium">
          Key name
        </Label>
        <div className="flex gap-2 max-w-md">
          <Input
            id="mcp-key-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            className="h-9"
            required
          />
          <Button type="submit" size="sm" disabled={creating || !name.trim()}>
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Generate
          </Button>
        </div>
      </form>

      {createdToken ? (
        <div className="mb-5 border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-md">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold">Key generated</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This secret is shown once.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCreatedToken(null)}
            >
              Dismiss
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={createdToken.token}
              aria-label="Generated MCP key"
              className="h-9 font-mono text-xs"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={copyToken}
                  aria-label="Copy MCP key"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? 'Copied' : 'Copy key'}</TooltipContent>
            </Tooltip>
          </div>
          <code className="block mt-2 text-[11px] text-muted-foreground break-all">
            SCALO_MCP_TOKEN={createdToken.token}
          </code>
        </div>
      ) : null}

      {(actionError || error) && (
        <p className="mb-4 text-xs text-destructive">
          {actionError || error?.message}
        </p>
      )}

      <Separator />

      <div className="pt-5">
        <h3 className="text-sm font-semibold mb-3">Your keys</h3>
        {isLoading ? (
          <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading keys
          </div>
        ) : data?.tokens.length ? (
          <div className="divide-y border-y">
            {data.tokens.map((token) => {
              const isExpired = new Date(token.expiresAt) <= new Date();
              const isActive = !token.revokedAt && !isExpired;

              return (
                <div
                  key={token.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {token.name}
                      </p>
                      <Badge variant={isActive ? 'secondary' : 'outline'}>
                        {token.revokedAt
                          ? 'Revoked'
                          : isExpired
                            ? 'Expired'
                            : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground mt-1">
                      {token.tokenPrefix}••••••••
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Last used {formatDate(token.lastUsedAt)} · Expires{' '}
                      {formatDate(token.expiresAt)}
                    </p>
                  </div>

                  {isActive ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Revoke ${token.name}`}
                          disabled={revokingId === token.id}
                        >
                          {revokingId === token.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke MCP key?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Editors using “{token.name}” will lose access.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => revokeToken(token.id)}
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-6 text-sm text-muted-foreground">No MCP keys yet.</p>
        )}
      </div>
    </div>
  );
}

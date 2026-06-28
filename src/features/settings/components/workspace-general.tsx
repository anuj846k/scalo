'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { FullOrganization, OrganizationBrief } from './workspace-dialog';

interface WorkspaceGeneralProps {
  org: FullOrganization | null;
  orgs: OrganizationBrief[];
  userId: string;
  onOrgUpdate: () => void;
  onSwitch: (orgId: string) => Promise<void>;
  isSwitching?: boolean;
}

export function WorkspaceGeneral({
  org,
  orgs,
  userId,
  onOrgUpdate,
  onSwitch,
  isSwitching = false,
}: WorkspaceGeneralProps) {
  const [name, setName] = useState(org?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otherOrgs = orgs.filter((o: OrganizationBrief) => o.id !== org?.id);

  const getRole = (target: FullOrganization | null) =>
    target?.members?.find((m) => m.userId === userId)?.role;

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error: err } = await authClient.organization.update({
      data: { name },
    });

    if (err) {
      setError(err.message || 'Failed to update organisation');
    } else {
      setSaved(true);
      onOrgUpdate();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleSwitch = async (orgId: string) => {
    await onSwitch(orgId);
  };

  const activeRole = getRole(org);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-5">General</h2>

      <Separator />
      <div className="py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{org?.name}</p>
              {activeRole && (
                <Badge
                  variant={
                    activeRole === 'owner'
                      ? 'default'
                      : activeRole === 'admin'
                        ? 'secondary'
                        : 'outline'
                  }
                  className="capitalize text-[10px] mt-1"
                >
                  {activeRole}
                </Badge>
              )}
            </div>
          </div>
          {activeRole === 'owner' && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                const el = document.getElementById('organisation-name');
                el?.focus();
              }}
            >
              Update profile
            </Button>
          )}
        </div>
      </div>

      {activeRole === 'owner' && (
        <>
          <Separator />
          <form onSubmit={handleSaveName} className="py-5 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="organisation-name"
                className="text-xs font-medium"
              >
                Organisation name
              </Label>
              <Input
                id="organisation-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Organisation"
                className="h-9 max-w-xs"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving} size="sm">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {error && <p className="text-xs text-destructive">{error}</p>}
              {saved && (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                  ✓ Updated
                </p>
              )}
            </div>
          </form>
        </>
      )}

      {orgs.length > 1 && (
        <>
          <Separator />
          <div className="py-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold">Switch organisation</h3>
              {isSwitching && (
                <span
                  role="status"
                  aria-live="polite"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Switching organisation…
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Select an organisation to make it your active one.
            </p>

            <div
              aria-busy={isSwitching ? true : undefined}
              className={cn(
                'space-y-2 transition-opacity',
                isSwitching && 'opacity-90',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3 transition-opacity',
                  isSwitching && 'opacity-60',
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {org?.name}
                  </span>
                </div>
                <Switch checked disabled size="sm" />
              </div>

              {otherOrgs.map((o: OrganizationBrief) => {
                const isDisabled = isSwitching;
                return (
                  <button
                    key={o.id}
                    onClick={() => handleSwitch(o.id)}
                    disabled={isDisabled}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border border-transparent hover:border-border px-4 py-3 text-left transition-colors hover:bg-muted/40',
                      isDisabled && 'cursor-not-allowed',
                      !isDisabled && 'cursor-pointer',
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {o.name}
                      </span>
                    </div>
                    <Switch
                      checked={false}
                      size="sm"
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

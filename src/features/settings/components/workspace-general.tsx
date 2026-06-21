'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { FullOrganization, OrganizationBrief } from './workspace-dialog';

interface WorkspaceGeneralProps {
  org: FullOrganization | null;
  orgs: OrganizationBrief[];
  userId: string;
  onOrgUpdate: () => void;
  onSwitch: (orgId: string) => Promise<void>;
}

export function WorkspaceGeneral({
  org,
  orgs,
  userId,
  onOrgUpdate,
  onSwitch,
}: WorkspaceGeneralProps) {
  const [name, setName] = useState(org?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);

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
      setError(err.message || 'Failed to update workspace');
    } else {
      setSaved(true);
      onOrgUpdate();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleSwitch = async (orgId: string) => {
    setSwitching(orgId);
    await onSwitch(orgId);
    setSwitching(null);
  };

  const activeRole = getRole(org);

  return (
    <div className='p-6'>
      <h2 className='text-lg font-semibold mb-5'>General</h2>

      <Separator />
      <div className='py-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/15'>
              <Building2 className='h-5 w-5 text-primary' />
            </div>
            <div>
              <p className='text-sm font-semibold'>{org?.name}</p>
              {activeRole && (
                <Badge
                  variant={
                    activeRole === 'owner'
                      ? 'default'
                      : activeRole === 'admin'
                        ? 'secondary'
                        : 'outline'
                  }
                  className='capitalize text-[10px] mt-1'
                >
                  {activeRole}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            type='button'
            onClick={() => {
              const el = document.getElementById('workspace-name');
              el?.focus();
            }}
          >
            Update profile
          </Button>
        </div>
      </div>

      <Separator />
      <form onSubmit={handleSaveName} className='py-5 space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='workspace-name' className='text-xs font-medium'>
            Workspace name
          </Label>
          <Input
            id='workspace-name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='My Workspace'
            className='h-9 max-w-xs'
            required
          />
        </div>
        <div className='flex items-center gap-3'>
          <Button type='submit' disabled={saving} size='sm'>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {error && <p className='text-xs text-destructive'>{error}</p>}
          {saved && (
            <p className='text-xs text-emerald-600 flex items-center gap-1.5'>
              ✓ Updated
            </p>
          )}
        </div>
      </form>

      {orgs.length > 1 && (
        <>
          <Separator />
          <div className='py-5'>
            <h3 className='text-sm font-semibold mb-1'>Switch workspace</h3>
            <p className='text-xs text-muted-foreground mb-4'>
              Toggle to switch your active workspace.
            </p>

            <div className='space-y-2'>
              <div className='flex items-center justify-between rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3'>
                <div className='flex items-center gap-3 min-w-0'>
                  <Building2 className='h-4 w-4 text-primary shrink-0' />
                  <span className='text-sm font-medium truncate'>
                    {org?.name}
                  </span>
                </div>
                <Switch checked disabled size='sm' />
              </div>

              {/* Other orgs */}
              {otherOrgs.map((o: OrganizationBrief) => (
                <button
                  key={o.id}
                  onClick={() => handleSwitch(o.id)}
                  disabled={switching === o.id}
                  className='flex w-full items-center justify-between rounded-lg border border-transparent hover:border-border px-4 py-3 text-left transition-colors hover:bg-muted/40 disabled:opacity-60 cursor-pointer'
                >
                  <div className='flex items-center gap-3 min-w-0'>
                    <Building2 className='h-4 w-4 text-muted-foreground shrink-0' />
                    <span className='text-sm font-medium truncate'>
                      {o.name}
                    </span>
                  </div>
                  <Switch
                    checked={false}
                    size='sm'
                    tabIndex={-1}
                    className='pointer-events-none'
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

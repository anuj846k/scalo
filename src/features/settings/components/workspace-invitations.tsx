'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';
import { Mail, Check, X, Building2, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { IncomingInvitation } from './workspace-dialog';

interface WorkspaceInvitationsProps {
  invitations: IncomingInvitation[];
  onActionComplete: () => void;
}

export function WorkspaceInvitations({
  invitations,
  onActionComplete,
}: WorkspaceInvitationsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (invitationId: string) => {
    setProcessingId(`accept-${invitationId}`);
    try {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });
      if (!error) {
        onActionComplete();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    setProcessingId(`reject-${invitationId}`);
    try {
      const { error } = await authClient.organization.rejectInvitation({
        invitationId,
      });
      if (!error) {
        onActionComplete();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Invites</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage invitations you have received to join other organizations.
        </p>
      </div>

      {invitations.length === 0 ? (
        <Empty className="py-12 border border-dashed rounded-lg">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No invitations found</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t received any organisation invitations.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_180px] gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/30 border-b">
            <span>Organisation</span>
            <span className="text-right">Actions</span>
          </div>
          {invitations.map((inv, i) => (
            <div key={inv.id}>
              {i > 0 && <Separator />}
              <div className="grid grid-cols-[1fr_180px] gap-4 px-4 py-3.5 items-center hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {inv.organization?.name || 'Organisation'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      Invited by:{' '}
                      <span className="font-medium text-foreground/80">
                        {inv.inviter?.name || inv.inviter?.email || 'Unknown'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent hover:border-transparent active:bg-destructive/15 transition-colors cursor-pointer"
                    onClick={() => handleReject(inv.id)}
                    disabled={processingId !== null}
                  >
                    {processingId === `reject-${inv.id}` ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs font-medium transition-colors cursor-pointer"
                    onClick={() => handleAccept(inv.id)}
                    disabled={processingId !== null}
                  >
                    {processingId === `accept-${inv.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    ) : (
                      <Check className="h-3.5 w-3.5 mr-1" />
                    )}
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

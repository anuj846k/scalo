"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { EmailInviteInput } from "./email-invite-input";
import { FullOrganization, OrganizationMember, OrganizationInvitation } from "./workspace-dialog";

interface WorkspaceMembersProps {
  org: FullOrganization | null;
  onOrgUpdate: () => void;
}

export function WorkspaceMembers({ org, onOrgUpdate }: WorkspaceMembersProps) {
  const [subTab, setSubTab] = useState<"members" | "invitations">("members");
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const members = org?.members || [];
  const invitations = org?.invitations || [];
  const pendingInvitations = invitations.filter((i: OrganizationInvitation) => i.status === "pending");
  const filteredMembers = members.filter((m: OrganizationMember) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.user?.name?.toLowerCase().includes(q) ||
      m.user?.email?.toLowerCase().includes(q)
    );
  });

  const handleSendInvites = async () => {
    if (!org?.id || emails.length === 0) return;
    setInviting(true);
    setInviteError(null);

    const results = await Promise.allSettled(
      emails.map((email) =>
        authClient.organization.inviteMember({
          organizationId: org.id,
          email,
          role: role as "member" | "admin",
        }),
      ),
    );

    const failed = results.filter(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && r.value.error),
    );

    if (failed.length > 0) {
      setInviteError(`Failed to invite ${failed.length} of ${emails.length} email(s)`);
      setInviting(false);
      return;
    }

    setEmails([]);
    setShowInvite(false);
    onOrgUpdate();
    setInviting(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Members</h2>

      {/* Sub-tabs */}
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => setSubTab("members")}
          className={cn(
            "text-sm font-medium pb-1.5 border-b-2 transition-colors cursor-pointer",
            subTab === "members"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Members
          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
            {members.length}
          </Badge>
        </button>
        <button
          onClick={() => setSubTab("invitations")}
          className={cn(
            "text-sm font-medium pb-1.5 border-b-2 transition-colors cursor-pointer",
            subTab === "invitations"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Invitations
          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
            {pendingInvitations.length}
          </Badge>
        </button>
      </div>

      {subTab === "members" && (
        <div className="space-y-4">
          {/* Search + Invite */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <div className="flex-1" />
            <Button size="sm" onClick={() => setShowInvite(!showInvite)}>
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite
            </Button>
          </div>

          {/* Invite form */}
          {showInvite && (
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <h4 className="text-sm font-semibold">Invite new members</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Type an email address and click the suggestion to add it.
                </p>
              </div>

              <EmailInviteInput emails={emails} onEmailsChange={setEmails} />

              {inviteError && (
                <p className="text-xs text-destructive">{inviteError}</p>
              )}

              {/* Role + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Role:</span>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-7 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowInvite(false); setEmails([]); }}
                  >
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendInvites}
                    disabled={inviting || emails.length === 0}
                  >
                    {inviting ? "Sending..." : "Send invitations"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Members table */}
          <MembersTable members={filteredMembers} />
        </div>
      )}

      {subTab === "invitations" && (
        <InvitationsTable invitations={pendingInvitations} />
      )}
    </div>
  );
}

/* ── Members table ── */
function MembersTable({ members }: { members: OrganizationMember[] }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="grid grid-cols-[1fr_100px_80px] gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/30 border-b">
        <span>User</span>
        <span>Joined</span>
        <span>Role</span>
      </div>
      {members.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No members found.
        </div>
      ) : (
        members.map((m: OrganizationMember, i: number) => (
          <div key={m.id}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-[1fr_100px_80px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  <AvatarImage src={m.user?.image || ""} alt={m.user?.name || ""} />
                  <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                    {(m.user?.name || m.user?.email || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate leading-tight">
                    {m.user?.name || "Unknown"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {m.user?.email}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {m.createdAt
                  ? new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
              </span>
              <Badge
                variant={m.role === "owner" ? "default" : m.role === "admin" ? "secondary" : "outline"}
                className="capitalize text-[10px] w-fit"
              >
                {m.role}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ── Invitations table ── */
function InvitationsTable({ invitations }: { invitations: OrganizationInvitation[] }) {
  return (
    <div className="rounded-lg border">
      <div className="grid grid-cols-4 gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground border-b bg-muted/30">
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Expires</span>
      </div>
      {invitations.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No pending invitations.
        </div>
      ) : (
        invitations.map((inv: OrganizationInvitation, i: number) => (
          <div key={inv.id}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <span className="text-sm truncate">{inv.email}</span>
              <Badge variant={inv.role === "admin" ? "secondary" : "outline"} className="capitalize text-[10px] w-fit">
                {inv.role || "member"}
              </Badge>
              <Badge variant="secondary" className="capitalize text-[10px] w-fit">
                {inv.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

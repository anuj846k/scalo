"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Settings, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { WorkspaceGeneral } from "./workspace-general";
import { WorkspaceMembers } from "./workspace-members";
import { WorkspaceInvitations } from "./workspace-invitations";

const navItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "members", label: "Members", icon: Users },
  { id: "invitations", label: "Invites", icon: Mail },
] as const;

type NavId = (typeof navItems)[number]["id"];

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  role: "owner" | "admin" | "member";
  createdAt: Date | string;
  user: OrganizationUser;
}

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "rejected";
  expiresAt: Date | string;
}

export interface FullOrganization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
  metadata?: Record<string, unknown> | null;
  members: OrganizationMember[];
  invitations: OrganizationInvitation[];
}

export interface OrganizationBrief {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
  metadata?: Record<string, unknown> | null;
}

export interface IncomingInvitation {
  id: string;
  email: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "rejected";
  expiresAt: Date | string | null;
  createdAt: Date | string;
  organizationId: string;
  inviterId: string;
  organization: {
    name: string;
  };
  inviter: {
    name: string | null;
    email: string;
  };
}

interface WorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function WorkspaceDialog({ open, onOpenChange, userId }: WorkspaceDialogProps) {
  const [activeNav, setActiveNav] = useState<NavId>("general");
  const [org, setOrg] = useState<FullOrganization | null>(null);
  const [orgs, setOrgs] = useState<OrganizationBrief[]>([]);
  const [incomingInvites, setIncomingInvites] = useState<IncomingInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrgs = useCallback(async () => {
    try {
      const [listRes, fullRes, invitesRes] = await Promise.all([
        authClient.organization.list({}),
        authClient.organization.getFullOrganization(),
        fetch("/api/invitations/pending").then((r) => r.json()),
      ]);

      const orgList = (listRes.data || []) as OrganizationBrief[];
      setOrgs(orgList);
      setIncomingInvites((invitesRes.invitations || []) as IncomingInvitation[]);

      let activeOrg: FullOrganization | null = null;
      if (fullRes.data) {
        activeOrg = fullRes.data as FullOrganization;
      } else if (orgList.length > 0) {
        const firstOrg = orgList[0];
        const detailRes = await authClient.organization.getFullOrganization({
          query: { organizationId: firstOrg.id },
        });
        if (detailRes.data) {
          activeOrg = detailRes.data as FullOrganization;
          await authClient.organization.setActive({ organizationId: firstOrg.id });
        }
      }
      setOrg(activeOrg);
    } catch (e) {
      console.error("Failed to load org data", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setLoading(true);
        fetchOrgs();
      });
    }
  }, [open, fetchOrgs]);

  const handleSwitch = async (orgId: string) => {
    await authClient.organization.setActive({ organizationId: orgId });
    const detailRes = await authClient.organization.getFullOrganization({
      query: { organizationId: orgId },
    });
    if (detailRes.data) setOrg(detailRes.data as FullOrganization);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl p-0 gap-0 overflow-hidden">
        <div className="flex min-h-[520px]">
          <div className="w-52 shrink-0 border-r bg-muted/20 p-5 flex flex-col">
            <DialogTitle className="text-base font-bold tracking-tight mb-0.5">
              Workspace
            </DialogTitle>
            <p className="text-xs text-muted-foreground mb-5">
              Manage your workspace
            </p>

            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                const showBadge = item.id === "invitations" && incomingInvites.length > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {showBadge && (
                      <span className="inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                        {incomingInvites.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto min-w-0">
            {loading ? (
              <div className="p-6 space-y-4">
                <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                <div className="h-px bg-muted" />
                <div className="h-32 rounded-lg bg-muted animate-pulse" />
              </div>
            ) : (
              <>
                {activeNav === "general" && (
                  <WorkspaceGeneral
                    org={org}
                    orgs={orgs}
                    userId={userId}
                    onOrgUpdate={fetchOrgs}
                    onSwitch={handleSwitch}
                  />
                )}
                {activeNav === "members" && (
                  <WorkspaceMembers org={org} onOrgUpdate={fetchOrgs} />
                )}
                {activeNav === "invitations" && (
                  <WorkspaceInvitations
                    invitations={incomingInvites}
                    onActionComplete={fetchOrgs}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

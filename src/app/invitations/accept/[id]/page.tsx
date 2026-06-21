"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AcceptInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [status, setStatus] = useState<"loading" | "accepting" | "accepted" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push(`/login?redirect=/invitations/accept/${id}`);
      return;
    }
    setStatus("accepting");
  }, [session, id, router]);

  const handleAccept = async () => {
    setStatus("accepting");
    setError(null);
    const { error: acceptError } = await authClient.organization.acceptInvitation({
      invitationId: id,
    });
    if (acceptError) {
      setError(acceptError.message || "Failed to accept invitation");
      setStatus("error");
      return;
    }
    setStatus("accepted");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Checking invitation...</p>
      </div>
    );
  }

  if (status === "accepting") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-xl font-bold">Accept Invitation</h1>
          <p className="mb-6 text-sm text-gray-500">
            You&apos;ve been invited to join a workspace.
          </p>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
            onClick={handleAccept}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80"
          >
            Accept Invitation
          </button>
        </div>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-xl font-bold">Invitation Accepted!</h1>
          <p className="mb-6 text-sm text-gray-500">
            You&apos;ve joined the workspace.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
}

'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { disconnectInstagram } from '../actions';

function InstagramStatus({
  igUsername,
  igUserId,
}: {
  igUsername: string | null;
  igUserId: string;
}) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const { success } = await disconnectInstagram();
      if (success) {
        router.refresh();
      }
    } catch {
      setDisconnecting(false);
    }
  };

  return (
    <div className='flex items-center justify-between p-4 border rounded-lg'>
      <div>
        <p className='font-medium'>
          {igUsername ? `@${igUsername}` : 'Instagram Account'}
        </p>
        <p className='text-sm text-muted-foreground'>ID: {igUserId}</p>
      </div>
      <Button
        variant='destructive'
        size='sm'
        onClick={handleDisconnect}
        disabled={disconnecting}
      >
        {disconnecting ? 'Disconnecting...' : 'Disconnect'}
      </Button>
    </div>
  );
}

function InstagramBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get('instagram');

  if (!status) return null;

  const messages: Record<
    string,
    { text: string; variant: 'success' | 'error' }
  > = {
    connected: {
      text: 'Instagram account connected successfully!',
      variant: 'success',
    },
    access_denied: {
      text: 'You denied the Instagram connection request.',
      variant: 'error',
    },
    state_mismatch: {
      text: 'Security check failed. Please try again.',
      variant: 'error',
    },
    no_code: {
      text: 'No authorization code received. Please try again.',
      variant: 'error',
    },
  };

  const msg = messages[status] || {
    text: `Error: ${status}`,
    variant: 'error' as const,
  };

  return (
    <div
      className={`p-3 rounded-lg text-sm font-medium ${
        msg.variant === 'success'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {msg.text}
    </div>
  );
}

export function InstagramSection({
  connected,
  igUsername,
  igUserId,
}: {
  connected: boolean;
  igUsername: string | null;
  igUserId: string | null;
}) {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold'>Instagram</h3>
        <p className='text-sm text-muted-foreground'>
          Connect your Instagram professional account to manage outreach and
          track campaigns.
        </p>
      </div>

      <Suspense fallback={null}>
        <InstagramBanner />
      </Suspense>

      {connected && igUserId ? (
        <Suspense
          fallback={<div className='p-4 border rounded-lg'>Loading...</div>}
        >
          <InstagramStatus igUsername={igUsername} igUserId={igUserId} />
        </Suspense>
      ) : (
        <Link href='/api/auth/meta/redirect'>
          <Button className='w-full sm:w-auto'>Connect Instagram</Button>
        </Link>
      )}
    </div>
  );
}

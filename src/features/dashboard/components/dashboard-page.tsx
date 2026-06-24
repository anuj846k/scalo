'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export default function DashboardPage() {
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    (async () => {
      const orgRes = await authClient.organization.getFullOrganization();
      if (orgRes.data) setOrgName(orgRes.data.name || '');
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {orgName ? `Welcome to ${orgName}` : 'Dashboard'}
        </h1>
      </div>
    </div>
  );
}

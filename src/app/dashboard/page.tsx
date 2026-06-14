// import { requireAuth } from '@/lib/auth-utils';
// import { DashboardGreeting } from '@/features/dashboard/components/dashboard-greeting';
// import { DashboardMetrics } from '@/features/dashboard/components/dashboard-metrics';
// import { DashboardChart } from '@/features/dashboard/components/dashboard-chart';
// import { AccountHealth } from '@/features/dashboard/components/account-health';
// import { FollowUpsDue } from '@/features/dashboard/components/follow-ups-due';
// import { RecentReplies } from '@/features/dashboard/components/recent-replies';

// const Dashboard = async () => {
//     const user = await requireAuth();

//     return (
//         <div className='flex flex-col min-h-screen w-full'>
//             <DashboardGreeting userName={user.name} />
//             <DashboardMetrics />

//             <div className="flex flex-col gap-4 mb-8">
//                 <div className="w-full">
//                     <DashboardChart />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <AccountHealth />
//                     <FollowUpsDue />
//                 </div>
//             </div>

//             <RecentReplies />
//         </div>
//     );
// };

// export default Dashboard;

import React from 'react';

const page = () => {
  return <div>page</div>;
};

export default page;

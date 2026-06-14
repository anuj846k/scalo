import {
  LayoutDashboard,
  Inbox,
  Users,
  Megaphone,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Inbox',
    url: '/dashboard/inbox',
    icon: Inbox,
  },
  {
    title: 'Creators',
    url: '/dashboard/creators',
    icon: Users,
  },
  {
    title: 'Campaigns',
    url: '/dashboard/campaigns',
    icon: Megaphone,
  },
  {
    title: 'Accounts',
    url: '/dashboard/accounts',
    icon: Building2,
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

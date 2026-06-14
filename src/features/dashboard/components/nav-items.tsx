import {
  LayoutDashboard,
  Inbox,
  Users,
  Megaphone,
  Building2,
  BarChart3,
  FileText,
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    url: '/dashboard/accounts',
    icon: Building2,
  },
  {
    title: 'Inbox',
    url: '/dashboard/inbox',
    icon: Inbox,
  },
  {
    title: 'Leads',
    url: '/dashboard/leads',
    icon: Users,
  },
  {
    title: 'Campaigns',
    url: '/dashboard/campaigns',
    icon: Megaphone,
  },

  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: BarChart3,
  },
  {
    title: 'Templates',
    url: '/dashboard/templates',
    icon: FileText,
  },
];

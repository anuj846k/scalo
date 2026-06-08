import {
  LayoutDashboard,
  Megaphone,
  Users,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Campaigns',
    url: '/dashboard/campaigns',
    icon: Megaphone,
  },
  {
    title: 'Creators',
    url: '/dashboard/creators',
    icon: Users,
  },
  {
    title: 'Templates',
    url: '/dashboard/templates',
    icon: FileText,
  },
  {
    title: 'Conversations',
    url: '/dashboard/conversations',
    icon: MessageSquare,
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

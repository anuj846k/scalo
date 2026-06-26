import { LayoutDashboard, Blocks, MessageSquareText } from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Connectors',
    url: '/dashboard/connectors',
    icon: Blocks,
  },
  {
    title: 'Chat',
    url: '/dashboard/chat',
    icon: MessageSquareText,
  },
];

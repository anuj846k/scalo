import { LayoutDashboard, Upload, MessageSquareText } from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Upload CSV',
    url: '/dashboard/upload',
    icon: Upload,
  },
  {
    title: 'Chat',
    url: '/dashboard/chat',
    icon: MessageSquareText,
  },
];

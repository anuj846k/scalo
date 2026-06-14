import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const replies = [
  {
    name: 'Sarah Jenkins',
    handle: '@fitness_journey',
    time: 'Replied 10m ago',
    status: 'Interested',
    message: 'Sounds great! Can you share more details about the deliverables?',
    campaign: 'Summer UGC',
    avatar: 'https://i.pravatar.cc/150?u=11',
    statusColor: 'text-emerald-700 bg-emerald-100 border-transparent',
    campaignColor: 'bg-primary/10 text-primary border-transparent'
  },
  {
    name: 'Sam Traveler',
    handle: '@travel.with.sam',
    time: 'Replied 25m ago',
    status: 'Pricing',
    message: "What's the budget for this campaign?",
    campaign: 'Travel Collab',
    avatar: 'https://i.pravatar.cc/150?u=12',
    statusColor: 'text-primary bg-primary/10 border-transparent',
    campaignColor: 'bg-primary/10 text-primary border-transparent'
  },
  {
    name: 'Queen UGC',
    handle: '@ugcqueen_',
    time: 'Replied 1h ago',
    status: 'Interested',
    message: "I'd love to collaborate. Let's schedule a call.",
    campaign: 'UGC Campaign',
    avatar: 'https://i.pravatar.cc/150?u=13',
    statusColor: 'text-emerald-700 bg-emerald-100 border-transparent',
    campaignColor: 'bg-primary/10 text-primary border-transparent'
  },
  {
    name: 'Mason Fit',
    handle: '@masonfitlife',
    time: 'Replied 2h ago',
    status: 'Not Interested',
    message: "Not the right fit for me right now.",
    campaign: 'Fitness Campaign',
    avatar: 'https://i.pravatar.cc/150?u=14',
    statusColor: 'text-muted-foreground bg-muted border-transparent',
    campaignColor: 'bg-primary/10 text-primary border-transparent'
  }
];

export function RecentReplies() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-black tracking-tighter">Recent Replies</h3>
        <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 hover:underline">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {replies.map((reply, i) => (
          <Card key={i} className="shadow-none border-border flex flex-col rounded-[24px]">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.avatar} alt={reply.handle} />
                    <AvatarFallback className="font-bold text-primary bg-primary/10">{reply.handle.substring(1, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{reply.handle}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{reply.time}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 h-5", reply.statusColor)}>
                  {reply.status}
                </Badge>
              </div>
              
              <p className="text-base font-medium text-foreground mb-6 line-clamp-3 flex-1 leading-snug">
                {reply.message}
              </p>
              
              <div className="mt-auto">
                <Badge variant="secondary" className={cn("text-xs font-bold px-3 py-1", reply.campaignColor)}>
                  {reply.campaign}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

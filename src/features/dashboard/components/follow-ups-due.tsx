import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const followUps = [
  { handle: '@fitwithtanya', campaign: 'Summer UGC', due: 'Due in 2h', avatar: 'https://i.pravatar.cc/150?u=1' },
  { handle: '@coach.mike', campaign: 'Fitness Campaign', due: 'Due in 5h', avatar: 'https://i.pravatar.cc/150?u=2' },
  { handle: '@lifeofjordan', campaign: 'Travel Collab', due: 'Due in 7h', avatar: 'https://i.pravatar.cc/150?u=3' },
  { handle: '@ugc.with.anna', campaign: 'UGC Campaign', due: 'Due in 1d', avatar: 'https://i.pravatar.cc/150?u=4' },
  { handle: '@explorewithkyle', campaign: 'Travel Collab', due: 'Due in 1d', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export function FollowUpsDue() {
  return (
    <Card className="col-span-1 shadow-none border-border flex flex-col bg-background rounded-[24px]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
        <CardTitle className="text-2xl font-black tracking-tighter">Follow-ups Due</CardTitle>
        <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 hover:underline transition-colors">
          See all
        </Link>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 mt-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-muted-foreground">Creators need your follow-up</span>
          <div className="text-xl font-black text-primary bg-primary/10 px-3 py-1 rounded-full leading-none">23</div>
        </div>
        
        <div className="flex flex-col gap-2">
          {followUps.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 hover:bg-muted/50 transition-colors cursor-pointer group/item">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.avatar} alt={item.handle} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{item.handle.substring(1, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-background rounded-full"></span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold truncate group-hover/item:text-primary transition-colors">{item.handle}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-muted-foreground hidden xl:inline-block w-[100px] truncate">
                  {item.campaign}
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md whitespace-nowrap border border-amber-500/20">
                  {item.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

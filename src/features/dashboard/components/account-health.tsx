import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LuInstagram as InstagramIcon } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const accounts = [
  {
    name: 'IG Pro #1',
    status: 'Healthy',
    percent: 92,
    dms: '50 / 50 DMs',
    color: 'bg-emerald-500',
    badgeColor: 'text-emerald-700 bg-emerald-100 border-transparent',
  },
  {
    name: 'IG Pro #2',
    status: 'Healthy',
    percent: 84,
    dms: '40 / 50 DMs',
    color: 'bg-emerald-500',
    badgeColor: 'text-emerald-700 bg-emerald-100 border-transparent',
  },
  {
    name: 'IG Pro #3',
    status: 'Warning',
    percent: 71,
    dms: '30 / 50 DMs',
    color: 'bg-yellow-500',
    badgeColor: 'text-yellow-700 bg-yellow-100 border-transparent',
  },
  {
    name: 'IG Pro #4',
    status: 'Warning',
    percent: 48,
    dms: '20 / 50 DMs',
    color: 'bg-yellow-500',
    badgeColor: 'text-yellow-700 bg-yellow-100 border-transparent',
  },
  {
    name: 'IG Pro #5',
    status: 'Paused',
    percent: 10,
    dms: '5 / 50 DMs',
    color: 'bg-rose-500',
    badgeColor: 'text-rose-700 bg-rose-100 border-transparent',
  },
];

export function AccountHealth() {
  return (
    <Card className='col-span-1 shadow-none border-border flex flex-col bg-background rounded-[24px]'>
      <CardHeader className='flex flex-row items-center justify-between pb-4 pt-6 px-6'>
        <CardTitle className='text-2xl font-black tracking-tighter'>
          Account Health
        </CardTitle>
        <Link
          href='#'
          className='text-sm font-bold text-primary hover:text-primary/80 hover:underline transition-colors'
        >
          See all
        </Link>
      </CardHeader>
      <CardContent className='flex-1 px-6 pb-6'>
        <div className='flex flex-col gap-2'>
          {accounts.map((account, i) => (
            <div key={i} className='flex items-center gap-3 py-2 px-1 hover:bg-muted/50 transition-colors group/item cursor-pointer'>
              <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0'>
                  <InstagramIcon className='w-4 h-4 text-foreground/70' />
              </div>

              <div className='flex-1 min-w-0 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold truncate max-w-[90px] group-hover/item:text-primary transition-colors'>
                    {account.name}
                  </span>
                  <Badge
                    variant='outline'
                    className={cn(
                      'text-[10px] px-1.5 py-0 rounded-md font-semibold h-5 border',
                      account.badgeColor,
                    )}
                  >
                    {account.status}
                  </Badge>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='w-16 sm:w-20 h-1.5 bg-muted rounded-full overflow-hidden'>
                    <div
                      className={cn('h-full rounded-full', account.color)}
                      style={{ width: `${account.percent}%` }}
                    />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className='text-sm font-black w-[45px] text-right whitespace-nowrap'>
                      {account.percent}%
                    </span>
                    <span className='text-[10px] text-muted-foreground hidden sm:block font-medium'>
                      {account.dms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

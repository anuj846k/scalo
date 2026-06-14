import { Card, CardContent } from '@/components/ui/card';
import {
  LuSend as SendIcon,
  LuCornerUpLeft as CornerUpLeftIcon,
  LuSmile as SmileIcon,
  LuFlame as FlameIcon,
  LuUsers as UsersIcon,
  LuBriefcase as BriefcaseIcon,
  LuArrowUp as ArrowUpIcon,
  LuArrowDown as ArrowDownIcon,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

const metrics = [
  {
    title: 'Messages Sent',
    value: '287',
    change: '+18.6%',
    trend: 'up',
    icon: SendIcon,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    comparison: 'vs May 13 - May 19',
  },
  {
    title: 'Replies Received',
    value: '52',
    change: '+22.4%',
    trend: 'up',
    icon: CornerUpLeftIcon,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    comparison: 'vs May 13 - May 19',
  },
  {
    title: 'Reply Rate',
    value: '18.1%',
    change: '+2.6%',
    trend: 'up',
    icon: SmileIcon,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    comparison: 'vs May 13 - May 19',
  },
  {
    title: 'Interested',
    value: '43',
    change: '+15.2%',
    trend: 'up',
    icon: FlameIcon,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-500/10 dark:bg-orange-500/20',
    comparison: 'vs May 13 - May 19',
  },

  {
    title: 'Creators Closed',
    value: '6',
    change: '+20.0%',
    trend: 'up',
    icon: BriefcaseIcon,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    comparison: 'vs May 13 - May 19',
  },
];

export function DashboardMetrics() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10'>
      {metrics.map((metric, i) => (
        <Card
          key={i}
          className='group shadow-none border-border hover:border-primary/50 hover:shadow-sm transition-all duration-300 rounded-[24px] bg-background'
        >
          <CardContent className='p-6 flex flex-col items-start relative overflow-hidden'>
            <div className='flex items-center gap-3 mb-4 w-full relative z-10'>
              <div className='p-2 rounded-full bg-primary/10 text-primary'>
                <metric.icon className='w-5 h-5' />
              </div>
              <span className='text-sm font-bold text-muted-foreground whitespace-nowrap'>
                {metric.title}
              </span>
            </div>

            <div className='flex flex-col gap-1 relative z-10 w-full'>
              <span className='text-4xl font-black tracking-tighter text-foreground'>
                {metric.value}
              </span>
              <div className='flex items-center w-full mt-1'>
                <span
                  className={cn(
                    'text-xs font-bold flex items-center px-2 py-0.5 rounded-full',
                    metric.trend === 'up'
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-rose-700 bg-rose-100',
                  )}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpIcon className='w-3 h-3 mr-1' />
                  ) : (
                    <ArrowDownIcon className='w-3 h-3 mr-1' />
                  )}
                  {metric.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

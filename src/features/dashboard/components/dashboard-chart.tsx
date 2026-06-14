'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'May 20', messages: 100, replies: 15 },
  { name: 'May 21', messages: 120, replies: 25 },
  { name: 'May 22', messages: 155, replies: 40 },
  { name: 'May 23', messages: 165, replies: 45 },
  { name: 'May 24', messages: 200, replies: 48 },
  { name: 'May 25', messages: 215, replies: 60 },
  { name: 'May 26', messages: 240, replies: 65 },
];

export function DashboardChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-none border-border h-full flex flex-col bg-background rounded-[24px]">
      
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
        <CardTitle className="text-2xl font-black tracking-tighter">Outreach Performance</CardTitle>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary font-bold">Messages Sent</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-200/50 dark:bg-blue-900/50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-blue-700 dark:text-blue-400 font-bold">Replies</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] w-full mt-4 px-2 sm:px-6 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0025F5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0025F5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#85B6FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#85B6FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid hsl(var(--border))', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                backgroundColor: 'hsl(var(--background))',
                fontWeight: 500
              }}
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="messages" 
              stroke="#0025F5" 
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorMessages)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#0025F5' }} 
            />
            <Area 
              type="monotone" 
              dataKey="replies" 
              stroke="#85B6FF" 
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorReplies)"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#85B6FF' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LuCalendar as CalendarIcon, LuPlus as PlusIcon } from 'react-icons/lu';
import { useState } from 'react';

export function DashboardGreeting({ userName }: { userName: string }) {
  const [date, setDate] = useState<Date>(new Date(2025, 4, 20)); // May 20, 2025 as demo data

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10'>
      <div>
        <h2 className='text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight'>
          <span className='mr-2 inline-block'>👋</span> Good morning, {userName}
        </h2>
        <p className='text-muted-foreground mt-2 text-base md:text-lg font-medium'>
          Here&apos;s what&apos;s happening with your outreach today.
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-[240px] justify-start text-left font-semibold bg-background border-border hover:bg-muted rounded-full px-5 h-12'
            >
              <CalendarIcon className='mr-3 h-5 w-5 text-muted-foreground' />
              May 20 - May 26, 2025
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0 rounded-2xl border-border shadow-lg'
            align='end'
          >
            <Calendar
              mode='single'
              selected={date}
              onSelect={(d) => d && setDate(d)}
              className='rounded-2xl'
            />
          </PopoverContent>
        </Popover>

        <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 h-12 shadow-none border-0'>
          <PlusIcon className='mr-2 h-5 w-5' /> New Campaign
        </Button>
      </div>
    </div>
  );
}

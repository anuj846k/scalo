'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

interface DayRow {
  date: string;
  total: number;
  avgRating: number;
  positive: number;
  negative: number;
  neutral: number;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const ratingChartConfig = {
  avgRating: {
    label: 'Avg Rating',
    color: '#0025f5',
  },
} satisfies ChartConfig;

export function SentimentCharts({
  dailySentiment,
  loading,
}: {
  dailySentiment?: DayRow[];
  loading?: boolean;
}) {
  if (loading || !dailySentiment) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dailySentiment.length === 0) return null;

  const dailyData = dailySentiment.map((d) => ({
    ...d,
    label: formatDateLabel(d.date),
  }));

  const weeklyData: Array<{
    label: string;
    positivePct: number;
    negativePct: number;
  }> = [];
  let weekStart = '';
  let weekPositive = 0;
  let weekNegative = 0;
  for (const day of dailySentiment) {
    const d = new Date(day.date);
    const monday = new Date(d);
    monday.setDate(d.getDate() - d.getDay() + 1);
    const weekKey = monday.toISOString().split('T')[0];
    if (weekKey !== weekStart) {
      if (weekStart) {
        const total = weekPositive + weekNegative;
        weeklyData.push({
          label:
            formatWeekLabel(weekStart) +
            ' - ' +
            formatWeekLabel(
              new Date(new Date(weekStart).getTime() + 6 * 86400000)
                .toISOString()
                .split('T')[0],
            ),
          positivePct: total > 0 ? Math.round((weekPositive / total) * 100) : 0,
          negativePct: total > 0 ? Math.round((weekNegative / total) * 100) : 0,
        });
      }
      weekStart = weekKey;
      weekPositive = 0;
      weekNegative = 0;
    }
    weekPositive += day.positive;
    weekNegative += day.negative;
  }
  if (weekStart) {
    const total = weekPositive + weekNegative;
    weeklyData.push({
      label: formatWeekLabel(weekStart),
      positivePct: total > 0 ? Math.round((weekPositive / total) * 100) : 0,
      negativePct: total > 0 ? Math.round((weekNegative / total) * 100) : 0,
    });
  }

  const weeklyChartConfig = {
    positivePct: {
      label: 'Positive %',
      color: '#059669',
    },
    negativePct: {
      label: 'Negative %',
      color: '#dc2626',
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Avg Rating (Daily)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer
            config={ratingChartConfig}
            className="min-h-[200px] w-full"
          >
            <LineChart
              data={dailyData}
              accessibilityLayer
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="avgRating"
                stroke="var(--color-avgRating)"
                strokeWidth={2.5}
                dot={false}
                type="monotone"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Sentiment % (Weekly)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer
            config={weeklyChartConfig}
            className="min-h-[200px] w-full"
          >
            <BarChart
              data={weeklyData}
              accessibilityLayer
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={(value) => `${value}%`} />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="positivePct"
                fill="var(--color-positivePct)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="negativePct"
                fill="var(--color-negativePct)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

import { Activity } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format, startOfMonth, subMonths } from 'date-fns';

export const description = 'A line chart';

interface ChartProps {
  chartData: { month: string; revenue: number }[] | undefined;
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartLineDefault({ chartData }: ChartProps) {
  const start = subMonths(startOfMonth(new Date()), 2);
  const end = startOfMonth(new Date());
  const description = format(start, 'MMMM') + ' – ' + format(end, 'MMMM yyyy');

  return (
    <div className="flex flex-col h-full px-2">
      <div className="p-0 m-0">
        <div>Revenue Chart</div>
        <div>{description}</div>
      </div>

      <div className="flex-1 p-0 m-0">
        <ResponsiveContainer width="100%" height={160}>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              width={500}
              height={180}
              data={chartData}
              margin={{ left: 12, right: 12, top: 20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="revenue"
                type="natural"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>

      <div className="flex-col items-start justify-start gap-2 text-sm pt-2">
        <div className="flex gap-2 font-medium">
          Latest data updated in real time
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-muted-foreground leading-none text-start">
          Showing total revenue for the last 3 months
        </div>
      </div>
    </div>
  );
}

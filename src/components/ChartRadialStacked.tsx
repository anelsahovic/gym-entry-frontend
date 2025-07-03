'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

const chartData = [{ month: 'January', desktop: 1260 }];

interface ChartDataProps {
  totalVisitors: number | undefined;
  chartColor: 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';
  label: string;
}

export function ChartRadialStacked({
  totalVisitors,
  chartColor,
  label,
}: ChartDataProps) {
  return (
    <div className="flex flex-col p-0">
      <div className="flex justify-center items-center p-0">
        <div className="max-w-[200px] h-[180px]">
          <RadialBarChart
            width={200}
            height={200}
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={80}
          >
            <PolarRadiusAxis tick={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 10}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalVisitors ? totalVisitors.toLocaleString() : 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 10}
                          className="fill-muted-foreground text-sm"
                        >
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>

            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={4}
              fill={`var(--${chartColor})`}
            />
          </RadialBarChart>
        </div>
      </div>
    </div>
  );
}

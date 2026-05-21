'use client';

import { Info } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyScopeChartItem } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from './common/Card';

type MonthlyEmissionsChartProps = {
  data: MonthlyScopeChartItem[];
};

const SCOPE_COLORS = {
  scope1: '#4a6a4b',
  scope2: '#6a896b',
  scope3: '#a8c4a9',
} as const;

const MonthlyEmissionsChart = ({ data }: MonthlyEmissionsChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    name: item.yearMonth.slice(5),
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          월별 GHG Scope 배출량
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          배출이 회사의 직접 활동, 구매 에너지, 가치사슬 중 어디에서 발생했는지
          확인할 수 있습니다.
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8e2"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                unit=" t"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8e2',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value, name) => {
                  const emissions =
                    typeof value === 'number' ? value.toFixed(3) : '0.000';

                  return [`${emissions} tCO₂e`, name];
                }}
                labelFormatter={(_, payload) => {
                  const yearMonth = payload?.[0]?.payload?.yearMonth;

                  return yearMonth ? `${yearMonth}` : '';
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
              />

              <Bar
                dataKey="scope1"
                name="Scope 1"
                stackId="scope"
                fill={SCOPE_COLORS.scope1}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="scope2"
                name="Scope 2"
                stackId="scope"
                fill={SCOPE_COLORS.scope2}
                radius={[0, 0, 0, 0]}
              />

              <Bar
                dataKey="scope3"
                name="Scope 3"
                stackId="scope"
                fill={SCOPE_COLORS.scope3}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 border-t border-border pt-3 flex-col gap-6">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              <strong>Scope 1</strong>은 직접 배출, <strong>Scope 2</strong>는 구매
              전기 등 에너지 사용에 따른 간접 배출, <strong>Scope 3</strong>는
              원소재·운송 등 가치사슬에서 발생하는 기타 간접 배출입니다.
            </p>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>제공된 모든 활동 데이터의 월별 배출량을 표시합니다.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyEmissionsChart;

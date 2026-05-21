'use client';

import { Info } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DISPLAY_UNIT, PCF_STAGE } from '@/constant/carbon';
import type { PcfStageChartItem } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from './common/Card';

type PcfBreakdownChartProps = {
  data: PcfStageChartItem[];
};

const PCF_STAGE_COLORS = ['#6a896b', '#8ba68c', '#a8c4a9'];

const PcfBreakdownChart = ({ data }: PcfBreakdownChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    stageLabel: PCF_STAGE[item.stage].koreanLabel,
    stageDescription: PCF_STAGE[item.stage].description,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          PCF 단계별 누적 배출량
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          제품 탄소발자국을 구성하는 주요 활동 단계를 원재료, 제조 에너지,
          운송·유통으로 나누어 누적 배출량을 보여줍니다.
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                unit=" t"
              />

              <YAxis
                dataKey="stageLabel"
                type="category"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8e2',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value, _name, props) => {
                  const emissions =
                    typeof value === 'number' ? value.toFixed(3) : '0.000';
                  const share = props.payload?.share ?? 0;

                  return [
                    `${emissions} ${DISPLAY_UNIT.emissions} (${share}%)`,
                    '배출량',
                  ];
                }}
                labelFormatter={(label) => `${label}`}
              />

              <Bar dataKey="emissions" radius={[0, 4, 4, 0]} maxBarSize={40}>
                {chartData.map((item, index) => (
                  <Cell
                    key={item.stage}
                    fill={PCF_STAGE_COLORS[index % PCF_STAGE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              <strong>PCF</strong>는 Product Carbon Footprint의 약자로, 제품이
              만들어지고 이동하는 과정에서 발생하는 탄소 배출량을 의미합니다. 단계별
              막대가 길수록 해당 단계가 전체 배출량에 더 많이 기여했다는 의미입니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PcfBreakdownChart;

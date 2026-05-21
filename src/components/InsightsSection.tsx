'use client';

import type { ComponentType } from 'react';
import { AlertTriangle, Building2, Info, Leaf, TrendingDown } from 'lucide-react';
import type { CarbonAccountingInsight } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from './common/Card';

type InsightType = 'scope' | 'lifecycle' | 'change' | 'tax';

type InsightCardProps = {
  type: InsightType;
  title: string;
  keyLabel: string;
  description: string;
  value?: string;
  basis?: string;
};

type InsightsSectionProps = {
  insights: CarbonAccountingInsight[];
};

const INSIGHT_TYPES: InsightType[] = ['scope', 'lifecycle', 'change', 'tax'];

const iconMap = {
  scope: Leaf,
  lifecycle: AlertTriangle,
  change: TrendingDown,
  tax: Building2,
} satisfies Record<InsightType, ComponentType<{ className?: string }>>;

const colorMap = {
  scope: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  lifecycle: 'border-amber-200 bg-amber-50 text-amber-700',
  change: 'border-blue-200 bg-blue-50 text-blue-700',
  tax: 'border-slate-200 bg-slate-50 text-slate-700',
} satisfies Record<InsightType, string>;

const InsightCard = ({ type, title, value, keyLabel, basis }: InsightCardProps) => {
  const Icon = iconMap[type];

  return (
    <div className={`rounded-lg border p-4 ${colorMap[type]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span className="text-lg font-bold leading-none">{keyLabel}</span>

            {value && (
              <span className={`text-xs font-medium ${colorMap[type]} opacity-90`}>
                {value}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-start gap-1.5">
            <Info className="mt-[2px] h-3.5 w-3.5 shrink-0" />
            {basis && (
              <p className="text-[11px] leading-relaxed opacity-70">{basis}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsSection = ({ insights }: InsightsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">탄소 회계 인사이트</CardTitle>
        <p className="text-xs text-muted-foreground">
          배출 데이터를 바탕으로 계산된 주요 리스크와 변화 포인트입니다.
        </p>
      </CardHeader>

      <CardContent>
        {insights.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            표시할 인사이트가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {insights.map((insight, index) => (
              <InsightCard
                key={`${insight.title}-${index}`}
                type={INSIGHT_TYPES[index % INSIGHT_TYPES.length]}
                title={insight.title}
                keyLabel={insight.keyLabel}
                description={insight.description}
                value={insight.value}
                basis={insight.basis}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsSection;

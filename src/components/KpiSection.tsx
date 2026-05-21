import React from 'react';
import { DISPLAY_UNIT, PCF_STAGE } from '@/constant/carbon';
import type { DashboardKpis } from '@/types/dashboard';
import KpiCard from './KpiCard';

type KpiSectionProps = {
  kpis: DashboardKpis;
};

const KpiSection = ({ kpis }: KpiSectionProps) => {
  const mainPcfStageLabel = kpis.mainPcfStage
    ? PCF_STAGE[kpis.mainPcfStage].koreanLabel
    : '없음';

  const momChangeValue =
    kpis.momChangeRate === null
      ? 'N/A'
      : `${kpis.momChangeRate > 0 ? '+' : ''}${kpis.momChangeRate.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="기준 월 배출량"
        value={`${kpis.monthlyEmissions.toFixed(3)} ${DISPLAY_UNIT.emissions}`}
        subtitle={`누적: ${kpis.totalEmissions.toFixed(3)} ${DISPLAY_UNIT.emissions}`}
        highlighted
        description={`${kpis.reportingMonth} 기준 전체 배출량입니다.`}
      />

      <KpiCard
        title="기준 월 예상 탄소세"
        value={`$${kpis.estimatedMonthlyTax.toFixed(2)}`}
        subtitle={`누적 예상: $${kpis.estimatedTotalTax.toFixed(2)}`}
        description="설정한 탄소세율을 기준 월 배출량에 적용한 추정값입니다."
      />

      <KpiCard
        title="전월 대비 변화율"
        value={momChangeValue}
        subtitle="직전 월 대비"
        change={kpis.momChangeRate ?? undefined}
        changeLabel="전월 대비"
        description="기준 월 배출량이 직전 월 대비 얼마나 변했는지 보여줍니다."
      />

      <KpiCard
        title="주요 PCF 단계"
        value={mainPcfStageLabel}
        subtitle="기준 월 최대 배출 단계"
        description="기준 월에서 가장 큰 배출 비중을 차지한 제품 탄소발자국 단계입니다."
      />
    </div>
  );
};

export default KpiSection;

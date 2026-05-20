import type { DashboardKpis } from '@/types/dashboard';

import SectionHeader from './common/SectionHeader';
import KpiSection from './KpiSection';

type DashboardOverviewSectionProps = {
  kpis: DashboardKpis;
};

const DashboardOverviewSection = ({ kpis }: DashboardOverviewSectionProps) => {
  return (
    <section className="mb-6">
      <SectionHeader
        title="기준 월 요약"
        description={`${kpis.reportingMonth} 기준 배출량, 예상 탄소세, 전월 대비 변화, 주요 PCF 단계를 요약합니다.`}
      />

      <div className="mt-3">
        <KpiSection kpis={kpis} />
      </div>
    </section>
  );
};

export default DashboardOverviewSection;

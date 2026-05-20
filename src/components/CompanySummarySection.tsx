import type { CompanySummaryRow } from '@/types/dashboard';
import SectionHeader from './common/SectionHeader';
import CompanySummaryTable from './CompanySummaryTable';

type CompanySummarySectionProps = {
  rows: CompanySummaryRow[];
};

const CompanySummarySection = ({ rows }: CompanySummarySectionProps) => {
  return (
    <section className="mb-6">
      <SectionHeader
        title="회사/계열사 요약"
        description="전기 사용량은 제조 계열사, 원소재 사용량은 소재 계열사, 운송량은 물류 계열사에 매핑해 회사별 배출량과 예상 탄소세를 비교합니다."
      />

      <div className="mt-3">
        <CompanySummaryTable rows={rows} />
      </div>
    </section>
  );
};

export default CompanySummarySection;

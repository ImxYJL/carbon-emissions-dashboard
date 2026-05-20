import type { MonthlyScopeChartItem, PcfStageChartItem } from '@/types/dashboard';

import MonthlyEmissionsChart from './MonthlyEmissionsChart';
import PcfBreakdownChart from './PcfBreakdownChart';

type DashboardAnalysisGridProps = {
  monthlyScopeChartData: MonthlyScopeChartItem[];
  pcfStageChartData: PcfStageChartItem[];
};

const DashboardAnalysisGrid = ({
  monthlyScopeChartData,
  pcfStageChartData,
}: DashboardAnalysisGridProps) => {
  return (
    <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <MonthlyEmissionsChart data={monthlyScopeChartData} />
      <PcfBreakdownChart data={pcfStageChartData} />
    </section>
  );
};

export default DashboardAnalysisGrid;

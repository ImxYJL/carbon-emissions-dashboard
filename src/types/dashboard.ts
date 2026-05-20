import type { PcfLifecycleStage } from './carbon';
import type { CompanyDto } from './api';

export type MonthlyScopeChartItem = {
  yearMonth: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
};

export type PcfStageChartItem = {
  stage: PcfLifecycleStage;
  emissions: number;
  share: number;
};

export type CompanySummaryRow = {
  companyId: string;
  companyName: string;
  country: CompanyDto['country'];
  totalEmissions: number;
  reportingMonthEmissions: number;
  scope3Share: number;
  topPcfStage: PcfLifecycleStage | null;
  estimatedTax: number;
  momChangeRate: number | null;
};

export type DashboardKpis = {
  reportingMonth: string;
  monthlyEmissions: number;
  totalEmissions: number;
  estimatedMonthlyTax: number;
  estimatedTotalTax: number;
  momChangeRate: number | null;
  mainPcfStage: PcfLifecycleStage | null;
};

export type CarbonAccountingInsight = {
  title: string;
  description: string;
};

export type DashboardData = {
  kpis: DashboardKpis;
  monthlyScopeChartData: MonthlyScopeChartItem[];
  pcfStageChartData: PcfStageChartItem[];
  companySummaryRows: CompanySummaryRow[];
  insights: CarbonAccountingInsight[];
};

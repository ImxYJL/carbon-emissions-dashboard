import { CompanyDto } from '@/types/api';
import { GhgEmission, GhgScope, PcfLifecycleStage } from '@/types/carbon';
import {
  CarbonAccountingInsight,
  CompanySummaryRow,
  DashboardData,
  DashboardKpis,
  MonthlyScopeChartItem,
  PcfStageChartItem,
} from '@/types/dashboard';

/**
 * 여러 회사의 emissions를 하나의 배열로 펼친다.
 */
export function getAllEmissions(companies: CompanyDto[]): GhgEmission[] {
  return companies.flatMap((company) => company.emissions);
}

/**
 * 대시보드에 보여줄 기준 월을 찾는다.
 *
 * 현재 MVP에서는 "활동 데이터가 가장 많은 월"을 기준 월로 사용한다.
 * 동률이면 더 최신 월을 사용한다.
 */
export function getReportingMonth(emissions: GhgEmission[]): string {
  if (emissions.length === 0) {
    return '';
  }

  const countByMonth = emissions.reduce<Record<string, number>>((acc, emission) => {
    acc[emission.yearMonth] = (acc[emission.yearMonth] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(countByMonth).sort(([monthA, countA], [monthB, countB]) => {
    if (countA !== countB) {
      return countB - countA;
    }

    return monthB.localeCompare(monthA);
  })[0][0];
}

/**
 * 숫자를 더할 때 부동소수점 노이즈를 줄이기 위한 보조 함수.
 * 화면 표시 포맷팅은 별도 formatter에서 처리한다.
 */
export function roundMetric(value: number, digits = 6): number {
  return Number(value.toFixed(digits));
}

/**
 * emissions 합계.
 */
export function sumEmissions(emissions: GhgEmission[]): number {
  return roundMetric(
    emissions.reduce((sum, emission) => sum + emission.emissions, 0),
  );
}

/**
 * 특정 월의 emissions만 추린다.
 */
export function filterEmissionsByMonth(
  emissions: GhgEmission[],
  yearMonth: string,
): GhgEmission[] {
  return emissions.filter((emission) => emission.yearMonth === yearMonth);
}

/**
 * 기준 월의 직전 월 문자열을 계산한다.
 */
export function getPreviousMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 2, 1);

  const previousYear = date.getFullYear();
  const previousMonth = String(date.getMonth() + 1).padStart(2, '0');

  return `${previousYear}-${previousMonth}`;
}

/**
 * 전월 대비 변화율.
 *
 * 직전 월 배출량이 0이면 비교 기준이 없으므로 null을 반환한다.
 */
export function calculateMoMChangeRate(
  currentValue: number,
  previousValue: number,
): number | null {
  if (previousValue === 0) {
    return null;
  }

  return roundMetric(((currentValue - previousValue) / previousValue) * 100, 2);
}

/**
 * Scope별 합계.
 */
export function getScopeTotals(emissions: GhgEmission[]): Record<GhgScope, number> {
  const initialTotals: Record<GhgScope, number> = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
  };

  return emissions.reduce<Record<GhgScope, number>>((acc, emission) => {
    acc[emission.scope] = roundMetric(acc[emission.scope] + emission.emissions);
    return acc;
  }, initialTotals);
}

/**
 * PCF 단계별 합계.
 */
export function getPcfStageTotals(
  emissions: GhgEmission[],
): Record<PcfLifecycleStage, number> {
  const initialTotals: Record<PcfLifecycleStage, number> = {
    rawMaterial: 0,
    manufacturingEnergy: 0,
    transportDistribution: 0,
  };

  return emissions.reduce<Record<PcfLifecycleStage, number>>((acc, emission) => {
    acc[emission.pcfStage] = roundMetric(
      acc[emission.pcfStage] + emission.emissions,
    );
    return acc;
  }, initialTotals);
}

/**
 * 가장 배출량이 큰 PCF 단계를 찾는다.
 */
export function getTopPcfStage(emissions: GhgEmission[]): PcfLifecycleStage | null {
  if (emissions.length === 0) {
    return null;
  }

  const stageTotals = getPcfStageTotals(emissions);

  const [topStage, topValue] = Object.entries(stageTotals).sort(
    ([, valueA], [, valueB]) => valueB - valueA,
  )[0] as [PcfLifecycleStage, number];

  if (topValue === 0) {
    return null;
  }

  return topStage;
}

/**
 * 월별 Scope 누적 막대 차트용 데이터.
 */
export function getMonthlyScopeChartData(
  emissions: GhgEmission[],
): MonthlyScopeChartItem[] {
  const groupedByMonth = emissions.reduce<Record<string, MonthlyScopeChartItem>>(
    (acc, emission) => {
      if (!acc[emission.yearMonth]) {
        acc[emission.yearMonth] = {
          yearMonth: emission.yearMonth,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        };
      }

      acc[emission.yearMonth][emission.scope] = roundMetric(
        acc[emission.yearMonth][emission.scope] + emission.emissions,
      );

      acc[emission.yearMonth].total = roundMetric(
        acc[emission.yearMonth].total + emission.emissions,
      );

      return acc;
    },
    {},
  );

  return Object.values(groupedByMonth).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );
}

/**
 * PCF 단계별 가로 막대 차트용 데이터.
 */
export function getPcfStageChartData(emissions: GhgEmission[]): PcfStageChartItem[] {
  const totalEmissions = sumEmissions(emissions);
  const stageTotals = getPcfStageTotals(emissions);

  return Object.entries(stageTotals).map(([stage, value]) => ({
    stage: stage as PcfLifecycleStage,
    emissions: roundMetric(value),
    share: totalEmissions === 0 ? 0 : roundMetric((value / totalEmissions) * 100, 2),
  }));
}

/**
 * 회사/계열사 요약 테이블용 데이터.
 */
export function getCompanySummaryRows(
  companies: CompanyDto[],
  taxRate: number,
  reportingMonth: string,
): CompanySummaryRow[] {
  const previousMonth = getPreviousMonth(reportingMonth);

  return companies.map((company) => {
    const totalEmissions = sumEmissions(company.emissions);

    const reportingMonthEmissions = sumEmissions(
      filterEmissionsByMonth(company.emissions, reportingMonth),
    );

    const previousMonthEmissions = sumEmissions(
      filterEmissionsByMonth(company.emissions, previousMonth),
    );

    const scopeTotals = getScopeTotals(company.emissions);

    const scope3Share =
      totalEmissions === 0
        ? 0
        : roundMetric((scopeTotals.scope3 / totalEmissions) * 100, 2);

    return {
      companyId: company.id,
      companyName: company.name,
      country: company.country,
      totalEmissions,
      reportingMonthEmissions,
      scope3Share,
      topPcfStage: getTopPcfStage(company.emissions),
      estimatedTax: roundMetric(totalEmissions * taxRate, 2),
      momChangeRate: calculateMoMChangeRate(
        reportingMonthEmissions,
        previousMonthEmissions,
      ),
    };
  });
}

/**
 * 기준 월 KPI 데이터.
 */
export function getDashboardKpis(
  companies: CompanyDto[],
  taxRate: number,
  reportingMonth: string,
): DashboardKpis {
  const allEmissions = getAllEmissions(companies);
  const previousMonth = getPreviousMonth(reportingMonth);

  const reportingMonthEmissions = filterEmissionsByMonth(
    allEmissions,
    reportingMonth,
  );

  const previousMonthEmissions = filterEmissionsByMonth(allEmissions, previousMonth);

  const monthlyEmissions = sumEmissions(reportingMonthEmissions);
  const previousMonthlyEmissions = sumEmissions(previousMonthEmissions);
  const totalEmissions = sumEmissions(allEmissions);

  return {
    reportingMonth,
    monthlyEmissions,
    totalEmissions,
    estimatedMonthlyTax: roundMetric(monthlyEmissions * taxRate, 2),
    estimatedTotalTax: roundMetric(totalEmissions * taxRate, 2),
    momChangeRate: calculateMoMChangeRate(
      monthlyEmissions,
      previousMonthlyEmissions,
    ),
    mainPcfStage: getTopPcfStage(reportingMonthEmissions),
  };
}

/**
 * 인사이트 카드용 문장 데이터.
 */
export function getCarbonAccountingInsights(
  companies: CompanyDto[],
  taxRate: number,
  reportingMonth: string,
): CarbonAccountingInsight[] {
  const allEmissions = getAllEmissions(companies);
  const scopeTotals = getScopeTotals(allEmissions);
  const totalEmissions = sumEmissions(allEmissions);
  const pcfStageChartData = getPcfStageChartData(allEmissions);
  const companySummaryRows = getCompanySummaryRows(
    companies,
    taxRate,
    reportingMonth,
  );

  const scope3Share =
    totalEmissions === 0
      ? 0
      : roundMetric((scopeTotals.scope3 / totalEmissions) * 100, 2);

  const lifecycleHotspot = [...pcfStageChartData].sort(
    (a, b) => b.emissions - a.emissions,
  )[0];

  const highestTaxCompany = [...companySummaryRows].sort(
    (a, b) => b.estimatedTax - a.estimatedTax,
  )[0];

  const kpis = getDashboardKpis(companies, taxRate, reportingMonth);

  const insights: CarbonAccountingInsight[] = [
    {
      title: 'Scope 3 집중 구간',
      description: `누적 배출량의 ${scope3Share}%가 원소재·운송 등 가치사슬 배출에서 발생했습니다.`,
    },
  ];

  if (lifecycleHotspot) {
    insights.push({
      title: '주요 PCF 배출 단계',
      description: `${lifecycleHotspot.stage} 단계가 전체 배출량의 ${lifecycleHotspot.share}%를 차지합니다.`,
    });
  }

  if (kpis.momChangeRate !== null) {
    insights.push({
      title: '배출량 변화 알림',
      description: `${reportingMonth} 배출량은 직전 월 대비 ${kpis.momChangeRate}% 변화했습니다.`,
    });
  }

  if (highestTaxCompany) {
    insights.push({
      title: '최대 탄소세 부담',
      description: `${highestTaxCompany.companyName}의 누적 예상 탄소세가 가장 큽니다.`,
    });
  }

  return insights;
}

/**
 * 대시보드 화면에서 바로 사용할 수 있는 최종 데이터 묶음.
 */
export function createDashboardData(params: {
  companies: CompanyDto[];
  taxRate: number;
  reportingMonth?: string;
}): DashboardData {
  const { companies, taxRate } = params;

  const allEmissions = getAllEmissions(companies);

  const reportingMonth = params.reportingMonth || getReportingMonth(allEmissions);

  return {
    kpis: getDashboardKpis(companies, taxRate, reportingMonth),
    monthlyScopeChartData: getMonthlyScopeChartData(allEmissions),
    pcfStageChartData: getPcfStageChartData(allEmissions),
    companySummaryRows: getCompanySummaryRows(companies, taxRate, reportingMonth),
    insights: getCarbonAccountingInsights(companies, taxRate, reportingMonth),
  };
}

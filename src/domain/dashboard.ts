import { GHG_SCOPE, PCF_STAGE } from '@/constant/carbon';
import type { CompanyDto } from '@/types/api';
import type { GhgEmission, GhgScope, PcfLifecycleStage } from '@/types/carbon';
import type {
  CarbonAccountingInsight,
  CompanySummaryRow,
  DashboardData,
  DashboardKpis,
  MonthlyScopeChartItem,
  PcfStageChartItem,
} from '@/types/dashboard';

const GHG_SCOPES: GhgScope[] = ['scope1', 'scope2', 'scope3'];

const PCF_STAGES: PcfLifecycleStage[] = [
  'rawMaterial',
  'manufacturingEnergy',
  'transportDistribution',
];

type ScopeTotals = Record<GhgScope, number>;

type PcfStageTotals = Record<PcfLifecycleStage, number>;

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
export function getScopeTotals(emissions: GhgEmission[]): ScopeTotals {
  const initialTotals: ScopeTotals = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
  };

  return emissions.reduce<ScopeTotals>((acc, emission) => {
    acc[emission.scope] = roundMetric(acc[emission.scope] + emission.emissions);
    return acc;
  }, initialTotals);
}

/**
 * PCF 단계별 합계.
 */
export function getPcfStageTotals(emissions: GhgEmission[]): PcfStageTotals {
  const initialTotals: PcfStageTotals = {
    rawMaterial: 0,
    manufacturingEnergy: 0,
    transportDistribution: 0,
  };

  return emissions.reduce<PcfStageTotals>((acc, emission) => {
    acc[emission.pcfStage] = roundMetric(
      acc[emission.pcfStage] + emission.emissions,
    );
    return acc;
  }, initialTotals);
}

/**
 * 가장 배출량이 큰 Scope를 찾는다.
 */
export function getDominantScope(scopeTotals: ScopeTotals): GhgScope | null {
  const dominantScope = GHG_SCOPES.reduce<GhgScope>((currentDominant, scope) => {
    return scopeTotals[scope] > scopeTotals[currentDominant]
      ? scope
      : currentDominant;
  }, 'scope1');

  return scopeTotals[dominantScope] === 0 ? null : dominantScope;
}

/**
 * 가장 배출량이 큰 PCF 단계를 찾는다.
 */
export function getTopPcfStage(emissions: GhgEmission[]): PcfLifecycleStage | null {
  if (emissions.length === 0) {
    return null;
  }

  const stageTotals = getPcfStageTotals(emissions);

  const topStage = PCF_STAGES.reduce<PcfLifecycleStage>((currentTopStage, stage) => {
    return stageTotals[stage] > stageTotals[currentTopStage]
      ? stage
      : currentTopStage;
  }, 'rawMaterial');

  return stageTotals[topStage] === 0 ? null : topStage;
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
 *
 * 전체 회사/계열사의 전체 기간 누적 배출량을 PCF 단계별로 집계한다.
 */
export function getPcfStageChartData(emissions: GhgEmission[]): PcfStageChartItem[] {
  const totalEmissions = sumEmissions(emissions);
  const stageTotals = getPcfStageTotals(emissions);

  return PCF_STAGES.map((stage) => {
    const emissionsByStage = roundMetric(stageTotals[stage]);

    return {
      stage,
      emissions: emissionsByStage,
      share:
        totalEmissions === 0
          ? 0
          : roundMetric((emissionsByStage / totalEmissions) * 100, 2),
    };
  });
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
    const dominantScope = getDominantScope(scopeTotals);

    return {
      companyId: company.id,
      companyName: company.name,
      country: company.country,
      totalEmissions,
      reportingMonthEmissions,
      dominantScope,
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
 *
 * 인사이트의 문장 템플릿은 고정되어 있지만,
 * 표시되는 Scope, PCF 단계, 변화율, 회사명, 세금은 모두 계산 결과에서 파생한다.
 */
export function getCarbonAccountingInsights(
  companies: CompanyDto[],
  taxRate: number,
  reportingMonth: string,
): CarbonAccountingInsight[] {
  const allEmissions = getAllEmissions(companies);
  const scopeTotals = getScopeTotals(allEmissions);
  const totalEmissions = sumEmissions(allEmissions);
  const dominantScope = getDominantScope(scopeTotals);

  const pcfStageChartData = getPcfStageChartData(allEmissions);
  const lifecycleHotspot = [...pcfStageChartData].sort(
    (a, b) => b.emissions - a.emissions,
  )[0];

  const companySummaryRows = getCompanySummaryRows(
    companies,
    taxRate,
    reportingMonth,
  );

  const highestTaxCompany = [...companySummaryRows].sort(
    (a, b) => b.estimatedTax - a.estimatedTax,
  )[0];

  const highestReportingMonthCompany = [...companySummaryRows].sort(
    (a, b) => b.reportingMonthEmissions - a.reportingMonthEmissions,
  )[0];

  const insights: CarbonAccountingInsight[] = [];

  if (dominantScope) {
    const dominantScopeShare =
      totalEmissions === 0
        ? 0
        : roundMetric((scopeTotals[dominantScope] / totalEmissions) * 100, 2);

    insights.push({
      title: '주요 GHG Scope',
      keyLabel: GHG_SCOPE[dominantScope].label,
      description: `전체 누적 배출량에서 ${GHG_SCOPE[dominantScope].label}가 가장 큰 비중을 차지합니다.`,
      value: `${dominantScopeShare}%`,
      basis: 'Scope별 누적 배출량 / 전체 누적 배출량',
    });
  }

  if (lifecycleHotspot && lifecycleHotspot.emissions > 0) {
    const stageLabel = PCF_STAGE[lifecycleHotspot.stage].koreanLabel;

    insights.push({
      title: '주요 PCF 배출 단계',
      keyLabel: stageLabel,
      description: `${stageLabel}가 전체 PCF 단계 중 가장 큰 배출 비중을 차지합니다.`,
      value: `${lifecycleHotspot.share}%`,
      basis: 'PCF 단계별 누적 배출량 / 전체 누적 배출량',
    });
  }

  if (highestReportingMonthCompany) {
    insights.push({
      title: '기준 월 주요 배출 계열사',
      keyLabel: highestReportingMonthCompany.companyName,
      description: `${reportingMonth} 기준 ${highestReportingMonthCompany.companyName}의 배출량이 가장 큽니다.`,
      value: `${highestReportingMonthCompany.reportingMonthEmissions.toFixed(3)} tCO₂e`,
      basis: '회사별 기준 월 배출량 비교',
    });
  }

  if (highestTaxCompany) {
    insights.push({
      title: '최대 탄소세 부담',
      keyLabel: highestTaxCompany.companyName,
      description: `${highestTaxCompany.companyName}의 누적 예상 탄소세가 가장 큽니다.`,
      value: `$${highestTaxCompany.estimatedTax.toFixed(2)}`,
      basis: '회사별 누적 배출량 × 탄소세율',
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

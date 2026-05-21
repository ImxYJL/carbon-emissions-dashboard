'use client';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import {
  COUNTRY_BY_CODE,
  DISPLAY_UNIT,
  GHG_SCOPE,
  PCF_STAGE,
} from '@/constant/carbon';
import type { CompanySummaryRow } from '@/types/dashboard';
import { Badge } from './common/Badge';
import { Card, CardContent, CardHeader, CardTitle } from './common/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './common/Table';

type CompanySummaryTableProps = {
  rows: CompanySummaryRow[];
};

const formatEmissions = (value: number) => {
  return `${value.toFixed(3)}`;
};

const formatTax = (value: number) => {
  return `$${value.toFixed(2)}`;
};

const formatMoMChange = (value: number | null) => {
  if (value === null) {
    return 'N/A';
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const CompanySummaryTable = ({ rows }: CompanySummaryTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">회사/계열사 요약</CardTitle>
        <p className="text-xs text-muted-foreground">
          각 회사/계열사의 누적 배출량, 기준 월 배출량, 최다 배출 Scope, 주요 PCF
          단계, 예상 탄소세를 비교합니다.
        </p>
      </CardHeader>

      <CardContent>
        {rows.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            표시할 회사/계열사 데이터가 없습니다.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[190px]">회사/계열사</TableHead>
                <TableHead className="text-center">국가</TableHead>
                <TableHead className="text-right">
                  누적 배출량
                  <span className="text-xs text-muted-foreground pl-1">
                    ({DISPLAY_UNIT.emissions})
                  </span>
                </TableHead>
                <TableHead className="text-right">
                  기준 월 배출량
                  <span className="text-xs text-muted-foreground pl-1">
                    ({DISPLAY_UNIT.emissions})
                  </span>
                </TableHead>
                <TableHead className="text-right">최다 배출 Scope</TableHead>
                <TableHead className="text-right">주요 PCF 단계</TableHead>
                <TableHead className="text-right">예상 탄소세</TableHead>
                <TableHead className="text-right">전월 대비</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => {
                const country = COUNTRY_BY_CODE[row.country];

                const topPcfStageLabel = row.topPcfStage
                  ? PCF_STAGE[row.topPcfStage].koreanLabel
                  : '없음';

                return (
                  <TableRow key={row.companyId}>
                    <TableCell className="font-medium">{row.companyName}</TableCell>

                    <TableCell className="text-center">
                      <span className="text-lg">{country?.flag ?? row.country}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      {formatEmissions(row.totalEmissions)}
                    </TableCell>

                    <TableCell className="text-right">
                      {formatEmissions(row.reportingMonthEmissions)}
                    </TableCell>

                    <TableCell className="text-right">
                      {row.dominantScope ? (
                        <div className="flex flex-col items-end gap-1">
                          {GHG_SCOPE[row.dominantScope].shortLabel}

                          <span className="text-xs text-muted-foreground">
                            {GHG_SCOPE[row.dominantScope].koreanLabel}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">없음</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">{topPcfStageLabel}</TableCell>

                    <TableCell className="text-right font-medium">
                      {formatTax(row.estimatedTax)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.momChangeRate === null ? (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        ) : row.momChangeRate > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : row.momChangeRate < 0 ? (
                          <TrendingDown className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}

                        <span
                          className={`text-sm ${
                            row.momChangeRate === null
                              ? 'text-muted-foreground'
                              : row.momChangeRate > 0
                                ? 'text-red-500'
                                : row.momChangeRate < 0
                                  ? 'text-emerald-500'
                                  : 'text-muted-foreground'
                          }`}
                        >
                          {formatMoMChange(row.momChangeRate)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySummaryTable;

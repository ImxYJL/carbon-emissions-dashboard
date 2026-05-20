'use client';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { COUNTRY_BY_CODE, PCF_STAGE } from '@/constant/carbon';
import type { CompanySummaryRow } from '@/types/dashboard';
import { Badge } from './common/Badge';
import { Card, CardContent } from './common/Card';
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
  return `${value.toFixed(3)} tCO₂e`;
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[190px]">회사/계열사</TableHead>
              <TableHead className="text-center">국가</TableHead>
              <TableHead className="text-right">누적 배출량</TableHead>
              <TableHead className="text-right">기준 월 배출량</TableHead>
              <TableHead className="text-right">Scope 3 비중</TableHead>
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
                    <Badge variant="secondary" className="font-normal">
                      {row.scope3Share.toFixed(1)}%
                    </Badge>
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
      </CardContent>
    </Card>
  );
};

export default CompanySummaryTable;

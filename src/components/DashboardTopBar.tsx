import { FileText, Plus } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import { Badge } from './common/Badge';
import { Button } from './common/Button';
import { DISPLAY_UNIT } from '@/constant/carbon';

type DashboardTopBarProps = {
  reportingMonth: string;
  taxRate: number;
  onOpenActivityDialog: () => void;
  onOpenNoteDialog: () => void;
};

const DashboardTopBar = ({
  reportingMonth,
  taxRate,
  onOpenActivityDialog,
  onOpenNoteDialog,
}: DashboardTopBarProps) => {
  return (
    <div className="mb-6">
      <SectionHeader
        size="main"
        title="탄소/PCF 배출량 대시보드"
        description="전기·원소재·운송 활동 데이터를 배출계수로 tCO₂e로 변환하고, GHG Scope와 PCF 단계별로 확인할 수 있습니다."
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="px-3 py-1.5 text-sm">
          <span className="font-normal text-muted-foreground">기준 월:</span>
          <span className="ml-1 font-semibold">{reportingMonth}</span>
        </Badge>

        <Badge variant="secondary" className="px-3 py-1.5 text-sm">
          <span className="font-normal text-muted-foreground">탄소세율:</span>
          <span className="ml-1 font-semibold">
            ${taxRate} / ${DISPLAY_UNIT.emissions}
          </span>
        </Badge>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onOpenActivityDialog}
        >
          <Plus className="h-4 w-4" />
          활동 데이터 추가
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onOpenNoteDialog}
        >
          <FileText className="h-4 w-4" />
          산정 메모 추가
        </Button>
      </div>

      <div className="mt-3 rounded-xl border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        현재 대시보드는 하나의 고객 그룹에 속한 전체 회사/계열사 데이터를 합산해
        보여줍니다. KPI와 차트는 그룹 전체 기준이며, 회사별 데이터는 회사/계열사 요약
        표에서 비교할 수 있습니다.
      </div>
    </div>
  );
};

export default DashboardTopBar;

import { Button } from '../common/Button';

type DashboardErrorStateProps = {
  onRetry: () => void;
};

const DashboardErrorFallback = ({ onRetry }: DashboardErrorStateProps) => {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">
            대시보드 데이터를 불러오지 못했습니다.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            일시적인 오류일 수 있습니다. 다시 시도해주세요.
          </p>

          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            다시 시도
          </Button>
        </section>
      </div>
    </main>
  );
};

export default DashboardErrorFallback;

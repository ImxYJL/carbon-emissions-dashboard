const LoadingFallback = () => (
  <main className="min-h-screen bg-background">
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    </div>
  </main>
);

export default LoadingFallback;

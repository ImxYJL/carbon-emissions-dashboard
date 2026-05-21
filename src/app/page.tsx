'use client';

import React from 'react';
import DashboardTopBar from '@/components/DashboardTopBar';
import DashboardBottomGrid from '@/components/DashboardBottomGrid';
import CompanySummarySection from '@/components/CompanySummarySection';
import DashboardOverviewSection from '@/components/DashboardOverviewSection';
import DashboardAnalysisGrid from '@/components/DashboardAnalysisGrid';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import DashboardErrorFallback from '@/components/fallback/DashboardErrorFallback';
import useDashboardData from '@/hooks/useDashboardData';
import useDashboardDialogs from '@/hooks/useDashboardDialogs';
import DashboardDialogSection from '@/components/DashboardDialogSection';

const DashboardPage = () => {
  const {
    taxRate,
    companies,
    posts,
    dashboardData,
    reportingMonth,
    isLoading,
    isError,
    refetch,
  } = useDashboardData();
  const {
    isActivityDialogOpen,
    setIsActivityDialogOpen,
    isNoteDialogOpen,
    setIsNoteDialogOpen,
  } = useDashboardDialogs();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isError || !dashboardData) {
    return <DashboardErrorFallback onRetry={refetch} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <DashboardTopBar
          reportingMonth={reportingMonth}
          taxRate={taxRate}
          onOpenActivityDialog={() => setIsActivityDialogOpen(true)}
          onOpenNoteDialog={() => setIsNoteDialogOpen(true)}
        />

        <DashboardOverviewSection kpis={dashboardData.kpis} />

        <DashboardAnalysisGrid
          monthlyScopeChartData={dashboardData.monthlyScopeChartData}
          pcfStageChartData={dashboardData.pcfStageChartData}
        />

        <CompanySummarySection rows={dashboardData.companySummaryRows} />

        <DashboardBottomGrid
          insights={dashboardData.insights}
          posts={posts}
          companies={companies}
          reportingMonth={reportingMonth}
        />

        <DashboardDialogSection
          companies={companies}
          isActivityDialogOpen={isActivityDialogOpen}
          onActivityDialogOpenChange={setIsActivityDialogOpen}
          isNoteDialogOpen={isNoteDialogOpen}
          onNoteDialogOpenChange={setIsNoteDialogOpen}
        />
      </div>
    </main>
  );
};

export default DashboardPage;

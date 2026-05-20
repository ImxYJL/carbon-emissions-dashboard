'use client';

import { createDashboardData } from '@/domain/dashboard';
import { useCompaniesQuery, usePostsQuery } from '@/queries/carbon';
import { useMemo } from 'react';

const TAX_RATE = 50;

const useDashboardData = () => {
  const companiesQuery = useCompaniesQuery();
  const postsQuery = usePostsQuery();

  const dashboardData = useMemo(() => {
    if (!companiesQuery.data) return null;

    return createDashboardData({
      companies: companiesQuery.data,
      taxRate: TAX_RATE,
    });
  }, [companiesQuery.data]);

  return {
    taxRate: TAX_RATE,
    companies: companiesQuery.data ?? [],
    posts: postsQuery.data ?? [],
    dashboardData,
    reportingMonth: dashboardData?.kpis.reportingMonth ?? '',

    isLoading: companiesQuery.isPending || postsQuery.isPending,
    isError: companiesQuery.isError || postsQuery.isError,
    refetch: () => {
      companiesQuery.refetch();
      postsQuery.refetch();
    },
  };
};

export default useDashboardData;

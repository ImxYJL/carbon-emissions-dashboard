import type { CompanyDto, PostDto } from '@/types/api';
import type { CarbonAccountingInsight } from '@/types/dashboard';
import InsightsSection from './InsightsSection';
import PostsList from './PostsList';

type DashboardBottomGridProps = {
  insights: CarbonAccountingInsight[];
  posts: PostDto[];
  companies: CompanyDto[];
  reportingMonth: string;
};

const DashboardBottomGrid = ({
  insights,
  posts,
  companies,
  reportingMonth,
}: DashboardBottomGridProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <InsightsSection insights={insights} />

      <PostsList
        posts={posts}
        companies={companies}
        reportingMonth={reportingMonth}
      />
    </section>
  );
};

export default DashboardBottomGrid;

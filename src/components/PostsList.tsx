'use client';

import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './common/Card';
import type { CompanyDto, PostDto } from '@/types/api';

type PostsListProps = {
  posts: PostDto[];
  companies: CompanyDto[];
  reportingMonth: string;
};

const PostsList = ({ posts, companies, reportingMonth }: PostsListProps) => {
  const getCompanyName = (resourceUid: string) => {
    const company = companies.find((item) => item.id === resourceUid);

    return company?.name ?? 'Unknown';
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const aIsReportingMonth = a.dateTime === reportingMonth;
    const bIsReportingMonth = b.dateTime === reportingMonth;

    if (aIsReportingMonth && !bIsReportingMonth) {
      return -1;
    }

    if (!aIsReportingMonth && bIsReportingMonth) {
      return 1;
    }

    return b.dateTime.localeCompare(a.dateTime);
  });

  const hasReportingMonthPosts = posts.some(
    (post) => post.dateTime === reportingMonth,
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">산정 메모</CardTitle>
        <p className="text-xs text-muted-foreground">
          특정 회사와 월에 연결된 배출량 변화의 배경, 산정 근거, 운영 메모를
          보여줍니다.
        </p>
      </CardHeader>

      <CardContent>
        {sortedPosts.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            아직 등록된 산정 메모가 없습니다.
          </div>
        ) : (
          <>
            {!hasReportingMonthPosts && (
              <p className="mb-3 text-xs text-muted-foreground">
                기준 월에 등록된 메모가 없어 최근 메모를 보여줍니다.
              </p>
            )}

            <div className="space-y-3">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <div className="mt-0.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {post.dateTime}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {getCompanyName(post.resourceUid)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PostsList;

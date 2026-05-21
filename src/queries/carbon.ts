import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createActivity,
  createOrUpdatePost,
  fetchCompanies,
  fetchCountries,
  fetchPosts,
} from '@/lib/api';
import { QUERY_KEY } from './queryKey';
import { RawActivity } from '@/types/carbon';
import { PostDto } from '@/types/api';

export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.companies],
    queryFn: fetchCompanies,
  });
};

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.countries],
    queryFn: fetchCountries,
  });
};

export const usePostsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.posts],
    queryFn: fetchPosts,
  });
};

export const useCreateActivityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<RawActivity, 'id'>) => createActivity(input),
    onSuccess: () => {
      // toast.success('활동 데이터가 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.companies] });
    },
    onError: () => {
      // toast.error('활동 데이터 추가에 실패했습니다.');
    },
  });
};

export const useCreateOrUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<PostDto, 'id'> & { id?: string }) =>
      createOrUpdatePost(input),
    onSuccess: () => {
      // toast.success('메모가 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts] });
    },
    onError: () => {
      // toast.error('메모 저장에 실패했습니다.');
    },
  });
};

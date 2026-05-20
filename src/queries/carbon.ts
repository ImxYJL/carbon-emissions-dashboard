import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrUpdatePost,
  fetchCompanies,
  fetchCountries,
  fetchPosts,
} from '@/lib/api';
import { QUERY_KEY } from './queryKey';

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

export const useCreateOrUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdatePost,
    onSuccess: () => {
      //toast.success('메모가 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.posts] });
    },
    onError: () => {
      //toast.error('메모 저장에 실패했습니다.');
    },
  });
};

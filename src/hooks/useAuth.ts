// hooks/useAuth.ts
import useSWR from 'swr';
import API from '@/services/axios';

const fetcher = (url: string) => API.get(url).then((res) => res.data);

export default function useAuth() {
  const { data, error, isLoading } = useSWR('/auth', fetcher, {
    revalidateOnFocus: false, //  Don't re-fetch when switching tabs
    revalidateOnReconnect: false, //  Don't re-fetch on reconnect
    refreshInterval: 0, //  Don't auto-refresh every X milliseconds
    shouldRetryOnError: false, //  don't retry on error

    dedupingInterval: 5 * 60 * 1000, //cache for 5 min
  });

  const isAuthenticated = !!data?.userId;

  return {
    isAuthenticated,
    userId: data?.userId ?? null,
    name: data?.name ?? null,
    username: data?.username ?? null,
    email: data?.email ?? null,
    role: data?.role ?? null,
    isLoading,
    error,
  };
}

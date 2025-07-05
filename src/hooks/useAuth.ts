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

  const demoData = {
    isAuthenticated: true,
    userId: '342c1841-26dc-4fd4-8f98-0d9e84de3a28',
    name: 'Demo User',
    username: 'demouser',
    email: 'demouser@mail.test',
    role: 'ADMIN',
    isLoading: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const realData = {
    isAuthenticated,
    userId: data?.userId ?? null,
    name: data?.name ?? null,
    username: data?.username ?? null,
    email: data?.email ?? null,
    role: data?.role ?? null,
    isLoading,
    error,
  };

  return demoData;
}

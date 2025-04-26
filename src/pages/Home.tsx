import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import Loading from '@/components/Loading';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>HOME DASHBOARD</h1>
    </div>
  );
}

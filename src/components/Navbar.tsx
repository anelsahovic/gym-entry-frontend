import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

export default function Navbar() {
  const { isAuthenticated, isLoading, name } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) {
    return <Loading />;
  }
  return <>{isAuthenticated && <div>Navbar {name}</div>}</>;
}

import { useAppContext } from '../context/AppProvider'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthLoading, user } = useAppContext();
  

  if (isAuthLoading) return <p>Loading...</p>;

  // una vez que termina de cargar, si no hay usuario → redirige
  if (!user) {
    return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

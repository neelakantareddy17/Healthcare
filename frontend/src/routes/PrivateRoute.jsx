import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default PrivateRoute;

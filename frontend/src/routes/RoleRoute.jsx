import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const redirectMap = { patient: '/patient', doctor: '/doctor', admin: '/admin' };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }
  return children;
}

export default RoleRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase();
  const requiredRole = role?.toUpperCase();

  if (userRole !== requiredRole) {
    const redirectMap = {
      PATIENT: '/patient',
      DOCTOR: '/doctor',
      ADMIN: '/admin',
    };

    return (
      <Navigate
        to={redirectMap[userRole] || '/login'}
        replace
      />
    );
  }

  return children;
}

export default RoleRoute;
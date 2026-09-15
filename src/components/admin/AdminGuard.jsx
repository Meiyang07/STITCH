import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '../../utils/authStorage';

export default function AdminGuard({ children }) {
  const location = useLocation();
  const session = getSession();

  if (!session || session.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location.pathname, adminRequired: true }} />;
  }

  return children;
}

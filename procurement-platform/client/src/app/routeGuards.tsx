import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './store';

type GuardProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: GuardProps) {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}

export function AdminRoute({ children }: GuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.accountType !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

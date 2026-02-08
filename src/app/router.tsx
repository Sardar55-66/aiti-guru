import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import type { JSX } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = useAuthStore(s => s.isAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

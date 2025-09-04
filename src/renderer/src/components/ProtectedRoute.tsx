import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté et essaie d'accéder à login/register, rediriger vers l'app
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

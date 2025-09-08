import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Base/sidebar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    // Non connecté → redirige vers login et conserve l'URL d'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    
      <div className="flex">
      <Sidebar />
        <div className="flex-1 overflow-auto">
        {children}
        </div>
      </div>
    );
};

export default ProtectedRoute;

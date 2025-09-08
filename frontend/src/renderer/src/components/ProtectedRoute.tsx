import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Base/sidebar";
import Header from "./Base/Header";

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
    
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 relative " >
          <Header />
          <div style={{ height: 'calc(100vh - 48px)'}} className="overflow-auto">
            {children}  
          </div>
        </div>
      </div>
    );
};

export default ProtectedRoute;

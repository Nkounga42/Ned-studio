import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";
import PluginWorkspace from "./pages/PluginWorkspace";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import "./assets/main.css";
import TabManager from "./components/TabManager";
import Sidebar from "./components/Base/sidebar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar />
                    <TabManager />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plugins"
              element={
                <ProtectedRoute>
                  <PluginWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={
                <ProtectedRoute>
              <div>404</div>
              </ProtectedRoute>
            } />
          </Routes>

          {/* Toaster en dehors des Routes */}
          <Toaster />
        </>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./contexts/ProtectedRoute"
import App from "./App"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Toaster } from "sonner"
import "./assets/main.css"
// import PluginWorkspace from "./pages/PluginWorkspace"
// import Settings from "./pages/Settings"
// import TabManager from "./components/TabManager"
import { MenuProvider } from "./contexts/MenuContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MenuProvider>
        <BrowserRouter>
          <>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* 
            <Route
              path="/"
              element={
                <ProtectedRoute> 
                    <TabManager /> 
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
*/}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <div>404</div>
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Toaster />
          </>
        </BrowserRouter>
      </MenuProvider>
    </AuthProvider>
  </React.StrictMode>
)

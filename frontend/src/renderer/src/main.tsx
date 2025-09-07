import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './assets/main.css'
import { Routes, Route } from 'react-router-dom'; 
import PluginWorkspace from './pages/PluginWorkspace';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

// Appliquer le thème DaisyUI au démarrage depuis localStorage
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme)
}

const AppWrapper = ()  => {

  return (
    <BrowserRouter>
      <StrictMode>
        <AuthProvider>
          <ProtectedRoute>
            {/* <TitleBar /> */}
              
               <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/app" element={<><Header /><App /></>} />
                <Route path="/plugins" element={<><Header /><PluginWorkspace /></>} />
                <Route path="/settings" element={<><Header /><Settings /></>} />
                <Route path="/" element={<><Header /><App /></>} />
                <Route path="*" element={<div>404</div>} />
              </Routes> 

            <Toaster />
          </ProtectedRoute>
        </AuthProvider>
      </StrictMode>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
)
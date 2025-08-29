import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './assets/main.css'
import TitleBar from './components/TitleBar'
import { Routes, Route } from 'react-router-dom'; 
// import PluginManager from './pages/PluginManager';
import PluginWorkspace from './pages/PluginWorkspace';
import Settings from './pages/Settings';


// Appliquer le thème DaisyUI au démarrage depuis localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StrictMode>
        <TitleBar />
        <main className="flex-1 mt-10 overflow-y-auto" style={{height: "calc(100vh-36px)"}}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/plugins" element={<PluginWorkspace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </main>
      </StrictMode>
    </BrowserRouter>
  </React.StrictMode>
);

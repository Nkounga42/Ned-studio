import React, { useState } from 'react'
import PluginManager from './pages/PluginManager'

function App(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<'home' | 'plugins'>('home')
  const navBar = () => {
    return (
      <nav className="app-nav">
        <button onClick={() => setCurrentView('home')} className="active">Home</button>
        <button onClick={() => setCurrentView('plugins')}>Plugins</button>
      </nav>
    )
  }
  if (currentView === 'plugins') {
    return (
      <div className="app">
        {navBar()}
        <PluginManager />
      </div>
    )
  }

   /* <nav className="app-nav">
    <button onClick={() => setCurrentView('home')} className="active">Home</button>
    <button onClick={() => setCurrentView('plugins')}>Plugins</button>
    </nav>  */ 
    return (
    <div className="app">
      app
    </div>
  )
}

export default App

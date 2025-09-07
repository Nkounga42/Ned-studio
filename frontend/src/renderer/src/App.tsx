import React, { useState } from 'react'
import PluginManager from './pages/PluginManager'
import Tabs from './components/TabManager'
import PluginWorkspace from './pages/PluginWorkspace'
import TabManager from './components/TabManager'

function App(): React.JSX.Element {
    return (
    <div className="app">
       
        <TabManager />
    </div>
  )
}

export default App
 
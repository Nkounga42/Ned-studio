import React, { useState } from 'react'

interface PluginAPI {
  showNotification: (message: string, type?: string) => Promise<boolean>
  getAppVersion: () => Promise<string>
  openDialog: (options: any) => Promise<any>
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
}

declare global {
  var pluginAPI: PluginAPI
}

const HelloWorldPlugin: React.FC = () => {
  const [count, setCount] = useState(0)
  const [appVersion, setAppVersion] = useState<string>('')

  const handleNotification = async () => {
    await pluginAPI.showNotification(`Hello from plugin! Count: ${count}`, 'info')
  }

  const handleGetVersion = async () => {
    const version = await pluginAPI.getAppVersion()
    setAppVersion(version)
    await pluginAPI.showNotification(`App version: ${version}`, 'success')
  }

  const handleOpenDialog = async () => {
    const result = await pluginAPI.openDialog({
      title: 'Select a file',
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (!result.canceled && result.filePaths.length > 0) {
      await pluginAPI.showNotification(`Selected: ${result.filePaths[0]}`, 'info')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🌍 Hello World Plugin
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>This is a simple example plugin demonstrating:</p>
        <ul>
          <li>React component rendering</li>
          <li>Plugin API usage</li>
          <li>State management</li>
          <li>Electron dialog integration</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              background: '#007acc',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Count: {count}
          </button>
        </div>

        <button 
          onClick={handleNotification}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Notification
        </button>

        <button 
          onClick={handleGetVersion}
          style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Get App Version
        </button>

        <button 
          onClick={handleOpenDialog}
          style={{
            background: '#ffc107',
            color: '#212529',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Open File Dialog
        </button>
      </div>

      {appVersion && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
          <strong>App Version:</strong> {appVersion}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <p>Plugin ID: hello-world test</p>
        <p>Version: 1.0.0</p>
      </div>
    </div>
  )
}

export default HelloWorldPlugin

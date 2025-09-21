import React, { useState, useEffect, useRef } from 'react'
import { LoadedPlugin } from '../../../types/plugin'
// import './PluginRenderer.css'

interface PluginRendererProps {
  plugin: LoadedPlugin
}

const PluginRenderer: React.FC<PluginRendererProps> = ({ plugin }) => {
  const [component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPluginComponent()
  }, [plugin.id])

  const loadPluginComponent = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading plugin:', plugin.id)
      console.log('Plugin path:', plugin.path)
      console.log('Plugin manifest:', plugin.manifest)

      // Load the plugin bundle
      const bundleCode = await window.api.plugins.load(plugin.id)
      console.log('Bundle code received:', bundleCode ? 'Yes' : 'No')
      console.log('Bundle code length:', bundleCode?.length || 0)
      
      if (!bundleCode) {
        throw new Error(`Failed to load plugin bundle for ${plugin.id}. Bundle code is empty.`)
      }

      // Create a safe execution environment for the plugin
      const moduleRequire = (name: string) => {
        // Provide React and other dependencies
        if (name === 'react') return React
        if (name === 'react-dom') return require('react-dom')
        throw new Error(`Module ${name} not found`)
      }

      // Create plugin API context
      const pluginAPI = {
        showNotification: window.api.pluginAPI.showNotification,
        getAppVersion: window.api.pluginAPI.getAppVersion,
        openDialog: window.api.pluginAPI.openDialog,
        writeFile: window.api.pluginAPI.writeFile,
        readFile: window.api.pluginAPI.readFile
      }

      // Create a global context for the plugin
      const originalGlobal = (window as any).global
      const originalModule = (window as any).module
      const originalExports = (window as any).exports
      const originalRequire = (window as any).require
      const originalPluginAPI = (window as any).pluginAPI

      // Set up the plugin environment
      ;(window as any).global = window
      ;(window as any).module = { exports: {} }
      ;(window as any).exports = (window as any).module.exports
      ;(window as any).require = moduleRequire
      ;(window as any).pluginAPI = pluginAPI

      try {
        // Execute the plugin bundle
        eval(bundleCode)
        
        // Get the component from the module exports or global
        let PluginComponent = (window as any).module.exports
        if (!PluginComponent && (window as any).HelloWorldPlugin) {
          PluginComponent = (window as any).HelloWorldPlugin
        }
        if (typeof PluginComponent !== 'function') {
          PluginComponent = PluginComponent?.default || PluginComponent
        }

        if (!PluginComponent || typeof PluginComponent !== 'function') {
          throw new Error('Plugin does not export a valid React component')
        }

        setComponent(() => PluginComponent)
      } finally {
        // Restore original globals
        if (originalGlobal !== undefined) {
          ;(window as any).global = originalGlobal
        } else {
          delete (window as any).global
        }
        if (originalModule !== undefined) {
          ;(window as any).module = originalModule
        } else {
          delete (window as any).module
        }
        if (originalExports !== undefined) {
          ;(window as any).exports = originalExports
        } else {
          delete (window as any).exports
        }
        if (originalRequire !== undefined) {
          ;(window as any).require = originalRequire
        } else {
          delete (window as any).require
        }
        if (originalPluginAPI !== undefined) {
          ;(window as any).pluginAPI = originalPluginAPI
        } else {
          delete (window as any).pluginAPI
        }
      }
    } catch (err) {
      console.error('Failed to load plugin component:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="plugin-renderer loading">
        <div className="loading-spinner">Loading plugin...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="plugin-renderer error">
        <div className=" ">
          <h3>Failed to load plugin</h3>
          <p>{error}</p>
          <button onClick={loadPluginComponent}>Retry</button>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="plugin-renderer error">
        <div className="error-message">
          <h3>No component found</h3>
          <p>Plugin did not export a valid React component</p>
        </div>
      </div>
    )
  }

  const PluginComponent = component

  return (
    <div className="plugin-renderer" ref={containerRef}>
      <div className="plugin-content">
        <React.Suspense fallback={<div>Loading plugin content...</div>}>
          <PluginComponent />
        </React.Suspense>
      </div>
    </div>
  )
}

export default PluginRenderer

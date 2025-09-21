import React, { useState } from "react"
import { 
  Play, 
  Bug, 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Bell,
  Settings,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  Memory
} from "lucide-react"
import { useNotify } from "../hooks/useNotify"

const TestPage: React.FC = () => {
  const notify = useNotify()
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({})
  const [isRunningTests, setIsRunningTests] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    setTestResults(prev => ({ ...prev, [testName]: 'pending' }))
    
    try {
      await testFn()
      setTestResults(prev => ({ ...prev, [testName]: 'success' }))
      notify.success(`Test "${testName}" réussi`)
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: 'error' }))
      notify.error(`Test "${testName}" échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const simulateAsyncOperation = (duration: number = 1000): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  const testSuite = {
    notifications: {
      name: "Système de Notifications",
      tests: [
        {
          name: "Toast Success",
          run: async () => {
            notify.success("Test de notification de succès")
            await simulateAsyncOperation(500)
          }
        },
        {
          name: "Toast Error",
          run: async () => {
            notify.error("Test de notification d'erreur")
            await simulateAsyncOperation(500)
          }
        },
        {
          name: "Toast avec Action",
          run: async () => {
            notify.custom({
              type: 'info',
              title: 'Test avec Action',
              message: 'Ceci est un test avec bouton d\'action',
              action: {
                label: 'Action Test',
                onClick: () => notify.success('Action exécutée!')
              }
            })
            await simulateAsyncOperation(500)
          }
        },
        {
          name: "Template Login",
          run: async () => {
            notify.useTemplate(() => notify.templates.loginSuccess('Utilisateur Test'))
            await simulateAsyncOperation(500)
          }
        }
      ]
    },
    system: {
      name: "Tests Système",
      tests: [
        {
          name: "LocalStorage",
          run: async () => {
            const testKey = 'test-key'
            const testValue = 'test-value'
            localStorage.setItem(testKey, testValue)
            const retrieved = localStorage.getItem(testKey)
            if (retrieved !== testValue) throw new Error('LocalStorage failed')
            localStorage.removeItem(testKey)
            await simulateAsyncOperation(300)
          }
        },
        {
          name: "API Window",
          run: async () => {
            if (!window.api) throw new Error('Window API not available')
            await simulateAsyncOperation(300)
          }
        },
        {
          name: "Theme System",
          run: async () => {
            const currentTheme = document.documentElement.getAttribute('data-theme')
            document.documentElement.setAttribute('data-theme', 'dark')
            await simulateAsyncOperation(200)
            document.documentElement.setAttribute('data-theme', currentTheme || 'light')
            await simulateAsyncOperation(300)
          }
        }
      ]
    },
    performance: {
      name: "Tests de Performance",
      tests: [
        {
          name: "Rendu Composant",
          run: async () => {
            const start = performance.now()
            // Simuler un rendu complexe
            for (let i = 0; i < 1000; i++) {
              document.createElement('div')
            }
            const end = performance.now()
            if (end - start > 100) throw new Error(`Rendu trop lent: ${(end - start).toFixed(2)}ms`)
            await simulateAsyncOperation(200)
          }
        },
        {
          name: "Mémoire",
          run: async () => {
            if ('memory' in performance) {
              const memInfo = (performance as any).memory
              if (memInfo.usedJSHeapSize > 50 * 1024 * 1024) {
                throw new Error(`Utilisation mémoire élevée: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
              }
            }
            await simulateAsyncOperation(300)
          }
        }
      ]
    }
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    setTestResults({})
    
    notify.info({
      title: 'Tests démarrés',
      message: 'Exécution de tous les tests en cours...'
    })

    for (const category of Object.values(testSuite)) {
      for (const test of category.tests) {
        await runTest(test.name, test.run)
        await simulateAsyncOperation(200) // Pause entre les tests
      }
    }

    setIsRunningTests(false)
    
    const totalTests = Object.values(testSuite).reduce((acc, category) => acc + category.tests.length, 0)
    const successfulTests = Object.values(testResults).filter(result => result === 'success').length
    const failedTests = Object.values(testResults).filter(result => result === 'error').length

    if (failedTests === 0) {
      notify.success({
        title: 'Tous les tests réussis!',
        message: `${successfulTests}/${totalTests} tests passés avec succès`
      })
    } else {
      notify.warning({
        title: 'Tests terminés avec des erreurs',
        message: `${successfulTests}/${totalTests} tests réussis, ${failedTests} échecs`
      })
    }
  }

  const getTestIcon = (result: 'pending' | 'success' | 'error' | undefined) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error" />
      case 'pending':
        return <div className="loading loading-spinner loading-xs"></div>
      default:
        return <TestTube className="h-4 w-4 text-base-content/50" />
    }
  }

  const systemInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    memory: 'memory' in performance ? `${((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Page de Test</h1>
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunningTests}
          className="btn btn-primary gap-2"
        >
          {isRunningTests ? (
            <>
              <div className="loading loading-spinner loading-sm"></div>
              Tests en cours...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Lancer tous les tests
            </>
          )}
        </button>
      </div>

      {/* Test Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(testSuite).map(([categoryKey, category]) => (
          <div key={categoryKey} className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg flex items-center gap-2">
                {categoryKey === 'notifications' && <Bell className="h-5 w-5" />}
                {categoryKey === 'system' && <Settings className="h-5 w-5" />}
                {categoryKey === 'performance' && <Cpu className="h-5 w-5" />}
                {category.name}
              </h2>
              
              <div className="space-y-2">
                {category.tests.map((test) => (
                  <div
                    key={test.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getTestIcon(testResults[test.name])}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <button
                      onClick={() => runTest(test.name, test.run)}
                      disabled={isRunningTests || testResults[test.name] === 'pending'}
                      className="btn btn-xs btn-outline"
                    >
                      Tester
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Information */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informations Système
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(systemInfo).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-base-content/70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-mono bg-base-200 p-2 rounded truncate">
                  {value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg">Actions Rapides</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => notify.success('Test de notification rapide')}
              className="btn btn-success btn-sm gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Notification
            </button>
            
            <button
              onClick={() => {
                const theme = document.documentElement.getAttribute('data-theme')
                const newTheme = theme === 'dark' ? 'light' : 'dark'
                document.documentElement.setAttribute('data-theme', newTheme)
                notify.info(`Thème changé: ${newTheme}`)
              }}
              className="btn btn-info btn-sm gap-2"
            >
              <Settings className="h-4 w-4" />
              Toggle Theme
            </button>
            
            <button
              onClick={() => {
                console.log('Test console log')
                notify.info('Message ajouté à la console')
              }}
              className="btn btn-warning btn-sm gap-2"
            >
              <Bug className="h-4 w-4" />
              Console Log
            </button>
            
            <button
              onClick={() => {
                const isOnline = navigator.onLine
                notify.custom({
                  type: isOnline ? 'success' : 'error',
                  title: 'État de connexion',
                  message: isOnline ? 'En ligne' : 'Hors ligne'
                })
              }}
              className="btn btn-primary btn-sm gap-2"
            >
              <Wifi className="h-4 w-4" />
              Test Connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage

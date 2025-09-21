import { useEffect, useState } from 'react'
import { Bell, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotify } from '../hooks/useNotify'

export default function Settings() {
  const [theme, setTheme] = useState<string>('light')
  const [language, setLanguage] = useState<string>('fr')
  const notify = useNotify()

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Synchroniser avec les changements de localStorage depuis ailleurs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const themes = [
    'light','dark','cupcake','bumblebee'
  ];

  const handleSave = () => {
    localStorage.setItem('theme', theme)
    notify.success({
      title: 'Paramètres sauvegardés',
      message: 'Vos préférences ont été enregistrées avec succès.'
    })
  }

  const testNotifications = {
    success: () => notify.success('Opération réussie !'),
    error: () => notify.error('Une erreur est survenue'),
    warning: () => notify.warning('Attention, action requise'),
    info: () => notify.info('Information importante'),
    withAction: () => notify.custom({
      type: 'info',
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version est disponible.',
      action: {
        label: 'Télécharger',
        onClick: () => notify.success('Téléchargement démarré !')
      }
    }),
    template: () => notify.useTemplate(() => notify.templates.loginSuccess('John Doe'))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Apparence</h2>
        <div className="flex items-center gap-4">
          <label className="w-40">Thème</label>
          <select
            className="border rounded px-3 py-2 bg-transparent"
            value={theme}
            onChange={(e) => {
              const newTheme = e.target.value;
              setTheme(newTheme);
              localStorage.setItem('theme', newTheme);
            }}
          >
            {themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Général</h2>
        <div className="flex items-center gap-4">
          <label className="w-40">Langue</label>
          <select
            className="border rounded px-3 py-2 bg-transparent"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Test des Notifications
        </h2>
        <p className="text-sm text-base-content/70">
          Testez le système de notifications avec différents types de messages.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            className="btn btn-success btn-sm gap-2"
            onClick={testNotifications.success}
          >
            <CheckCircle className="h-4 w-4" />
            Succès
          </button>
          <button
            className="btn btn-error btn-sm gap-2"
            onClick={testNotifications.error}
          >
            <AlertCircle className="h-4 w-4" />
            Erreur
          </button>
          <button
            className="btn btn-warning btn-sm gap-2"
            onClick={testNotifications.warning}
          >
            <AlertTriangle className="h-4 w-4" />
            Avertissement
          </button>
          <button
            className="btn btn-info btn-sm gap-2"
            onClick={testNotifications.info}
          >
            <Info className="h-4 w-4" />
            Information
          </button>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={testNotifications.withAction}
          >
            <Bell className="h-4 w-4" />
            Avec Action
          </button>
          <button
            className="btn btn-secondary btn-sm gap-2"
            onClick={testNotifications.template}
          >
            <CheckCircle className="h-4 w-4" />
            Template
          </button>
        </div>
      </section>

      <section className="pt-4">
        <button
          className="btn btn-primary gap-2"
          onClick={handleSave}
        >
          <CheckCircle className="h-4 w-4" />
          Sauvegarder
        </button>
      </section>
    </div>
  )
}



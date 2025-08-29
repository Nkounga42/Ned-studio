import { useEffect, useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState<string>('light');
  const [language, setLanguage] = useState<string>('fr');

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
    localStorage.setItem('theme', theme);
    alert('Paramètres sauvegardés');
  };

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

      <section className="pt-4">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSave}
        >
          Sauvegarder
        </button>
      </section>
    </div>
  );
}



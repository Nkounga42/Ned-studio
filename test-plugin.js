// Plugin de test simple pour NED Studio
import React from 'react';

const TestPlugin = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plugin de Test</h1>
      <p className="text-base-content/70 mb-4">
        Ceci est un plugin de test importé avec succès !
      </p>
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Fonctionnalités du plugin</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Interface React moderne</li>
            <li>Styles DaisyUI intégrés</li>
            <li>Importation dynamique</li>
            <li>Système de plugins extensible</li>
          </ul>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary">Action du plugin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPlugin;

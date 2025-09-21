import React, { useState } from 'react'
import { Download, X } from 'lucide-react'
import { useNotify } from '../hooks/useNotify'

interface ImportUrlModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (url: string) => Promise<void>
  importing: boolean
}

const ImportUrlModal: React.FC<ImportUrlModalProps> = ({
  isOpen,
  onClose,
  onImport,
  importing
}) => {
  const [url, setUrl] = useState("")
  const notify = useNotify()

  const handleImport = async () => {
    if (!url.trim()) {
      notify.error({
        title: 'URL manquante',
        message: 'Veuillez saisir une URL valide'
      })
      return
    }

    try {
      await onImport(url.trim())
      setUrl("")
      onClose()
    } catch (error) {
      // L'erreur est gérée par le composant parent
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Importer un module depuis une URL</h3>

        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">URL du module</span>
            </label>
            <input
              type="url"
              placeholder="https://github.com/user/plugin.git"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input input-bordered w-full"
              disabled={importing}
            />
          </div>

          <div className="alert alert-info">
            <div className="text-sm">
              <strong>Formats supportés:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Dépôts Git (GitHub, GitLab, etc.)</li>
                <li>Archives ZIP directes</li>
                <li>Fichiers JavaScript/TypeScript</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button
            onClick={() => !importing && onClose()}
            className="btn btn-ghost"
            disabled={importing}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </button>
          <button
            onClick={handleImport}
            className="btn btn-primary"
            disabled={importing || !url.trim()}
          >
            {importing ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Téléchargement...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Importer
              </>
            )}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !importing && onClose()}
      ></div>
    </div>
  )
}

export default ImportUrlModal

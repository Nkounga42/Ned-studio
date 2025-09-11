import React, { useState, useRef, useEffect } from "react";

export default function BuildRenderer() {
  const [mode, setMode] = useState("upload");
  const [files, setFiles] = useState([]);
  const [fileMap, setFileMap] = useState({}); // path -> blobURL
  const [indexHtmlName, setIndexHtmlName] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [logs, setLogs] = useState([]);
  const iframeRef = useRef(null);

  useEffect(() => {
    return () => {
      Object.values(fileMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileMap]);

  const humanSize = (n) => {
    if (!n && n !== 0) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let v = n;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(2)} ${units[i]}`;
  };

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles(arr);
    const map = {};
    arr.forEach((f) => {
      const key = f.webkitRelativePath || f.name;
      map[key] = URL.createObjectURL(f);
    });
    Object.values(fileMap).forEach((url) => URL.revokeObjectURL(url));
    setFileMap(map);

    const idx = arr.find((f) => f.name.toLowerCase() === "index.html") || arr.find((f) => /index\.html$/i.test(f.name));
    setIndexHtmlName(idx ? (idx.webkitRelativePath || idx.name) : "");
    log(`Chargé ${arr.length} fichier(s).`);
  };

  const log = (text) => {
    setLogs((l) => [text, ...l].slice(0, 50));
  };

  const buildFromUpload = async () => {
    if (!indexHtmlName) {
      log("Aucun index.html détecté.");
      return;
    }

    const indexFile = files.find((f) => (f.webkitRelativePath || f.name) === indexHtmlName);
    if (!indexFile) {
      log("Fichier index introuvable.");
      return;
    }

    const text = await indexFile.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const replaceAttr = (selector, attr) => {
      const nodes = Array.from(doc.querySelectorAll(selector));
      nodes.forEach((node) => {
        const val = node.getAttribute(attr);
        if (!val) return;
        if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("//")) return;

        if (fileMap[val]) {
          node.setAttribute(attr, fileMap[val]);
          log(`Remplacé ${val} -> blob`);
          return;
        }

        const seg = val.split("/").filter(Boolean).pop();
        if (seg && fileMap[seg]) {
          node.setAttribute(attr, fileMap[seg]);
          log(`Remplacé ${val} -> ${seg}`);
          return;
        }

        const candidate = Object.keys(fileMap).find((k) => k.endsWith(seg));
        if (candidate) {
          node.setAttribute(attr, fileMap[candidate]);
          log(`Remplacé (fuzzy) ${val} -> ${candidate}`);
        } else {
          log(`Pas trouvé: ${val}`);
        }
      });
    };

    replaceAttr("script", "src");
    replaceAttr("link[rel=stylesheet]", "href");
    replaceAttr("img", "src");
    replaceAttr("source", "src");

    const serializer = new XMLSerializer();
    const newHtml = `<!doctype html>\n${serializer.serializeToString(doc)}`;

    const blob = new Blob([newHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    if (iframeSrc) URL.revokeObjectURL(iframeSrc);
    setIframeSrc(url);

    log("Build chargé dans l'iframe.");
  };

  const loadFromUrl = () => {
    if (!baseUrl) return;
    let url = baseUrl;
    if (!/https?:\/\//i.test(url)) url = `https://${url}`;
    if (!url.endsWith("/")) url += "/";
    const idxUrl = url + "index.html";
    setIframeSrc(idxUrl);
    log(`Chargé depuis URL: ${idxUrl}`);
  };

  const openInNewTab = () => {
    if (!iframeSrc) return;
    window.open(iframeSrc, "_blank");
  };

  const onSelectIndex = (ev) => {
    setIndexHtmlName(ev.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Build Renderer — charger un projet déjà build</h1>

      <div className="mb-4 p-3 bg-base-200/80 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            className={`px-3 py-1 rounded ${mode === "upload" ? "bg-sky-600 text-base-200" : "bg-gray-100"}`}
            onClick={() => setMode("upload")}
          >
            Upload de fichiers
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === "url" ? "bg-sky-600 text-base-200" : "bg-gray-100"}`}
            onClick={() => setMode("url")}
          >
            Charger depuis une URL
          </button>
        </div>

        {mode === "upload" ? (
          <div>
            <p className="text-sm mb-2">Sélectionnez le dossier du build (index.html, index.js, index.css, assets/...).</p>
            <input
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {files.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium">Fichiers détectés</label>
                <select value={indexHtmlName} onChange={onSelectIndex} className="mt-1 w-full p-1 border rounded">
                  <option value="">-- sélectionner index.html --</option>
                  {files.map((f) => (
                    <option key={f.webkitRelativePath || f.name} value={f.webkitRelativePath || f.name}>
                      {f.webkitRelativePath || f.name} — {humanSize(f.size)}
                    </option>
                  ))}
                </select>

                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-base-200 rounded" onClick={buildFromUpload}>Générer et charger</button>
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => { setFiles([]); setFileMap({}); setIndexHtmlName(""); setIframeSrc(""); log("Réinitialisé."); }}>Réinitialiser</button>
                  <button className="px-3 py-1 bg-blue-600 text-base-200 rounded" onClick={openInNewTab} disabled={!iframeSrc}>Ouvrir dans un nouvel onglet</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm mb-2">Entrez la base URL publique du build.</p>
            <div className="flex gap-2">
              <input className="flex-1 p-2 border rounded" placeholder="https://example.com/my-react-app/" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
              <button className="px-3 py-1 bg-green-600 text-base-200 rounded" onClick={loadFromUrl}>Charger</button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2 bg-base-200 p-2 rounded shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Aperçu</div>
            <div className="text-xs text-gray-600">Iframe</div>
          </div>
          <div className="border rounded overflow-hidden" style={{ height: 480 }}>
            {iframeSrc ? (
              <iframe
                ref={iframeRef}
                title="build-preview"
                src={iframeSrc}
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Aucun build chargé</div>
            )}
          </div>
        </div>

        <div className="bg-base-200 p-2 rounded shadow-sm">
          <div className="text-sm font-medium mb-2">Détails / fichiers</div>
          <div className="text-xs text-gray-700 mb-2">{files.length} fichier(s) uploadés.</div>
          <div className="space-y-1 max-h-48 overflow-auto text-sm">
            {files.map((f) => (
              <div key={f.webkitRelativePath || f.name} className="flex justify-between items-center px-1">
                <div className="truncate">{f.webkitRelativePath || f.name}</div>
                <div className="text-gray-500 text-xs">{humanSize(f.size)}</div>
              </div>
            ))}
            {files.length === 0 && <div className="text-gray-400">Aucun fichier</div>}
          </div>

          <div className="mt-3 text-sm">
            <div className="font-medium">Logs</div>
            <div className="mt-1 max-h-32 overflow-auto text-xs text-gray-600 bg-gray-50 p-1 rounded">
              {logs.map((l, i) => <div key={i}>{l}</div>)}
              {logs.length === 0 && <div className="text-gray-400">Aucun événement</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

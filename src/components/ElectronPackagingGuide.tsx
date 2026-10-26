import React, { useState } from 'react';
import {
  Package,
  Terminal,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Download,
  Cpu,
} from 'lucide-react';
import { pipAudio } from '../utils/audio';

export const ElectronPackagingGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<'main' | 'preload' | 'builder' | 'readme'>('main');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    pipAudio.playClick();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CODE_SNIPPETS = {
    main: `// electron/main.js - Transparent Always-on-Top Floating Windows Process
const { app, BrowserWindow, screen, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');

let companionWindow = null;

function createCompanionWindow() {
  const { width, height } = screen.getPrimaryDisplay().workArea;

  companionWindow = new BrowserWindow({
    width: 380,
    height: 440,
    x: width - 400,
    y: height - 460,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  companionWindow.setAlwaysOnTop(true, 'screen-saver');
  companionWindow.loadURL('http://localhost:3000?mode=companion');
}

app.whenReady().then(createCompanionWindow);`,

    preload: `// electron/preload.js - Secure Preload Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pipDesktop', {
  isElectron: true,
  platform: process.platform,
  moveWindow: (deltaX, deltaY) => ipcRenderer.send('pip:move', { deltaX, deltaY }),
  setPosition: (x, y) => ipcRenderer.send('pip:set-position', { x, y }),
  getScreenBounds: () => ipcRenderer.invoke('pip:get-bounds'),
  setAlwaysOnTop: (always) => ipcRenderer.send('pip:toggle-always-on-top', always),
  openPathPilot: (url) => ipcRenderer.send('pip:open-pathpilot', url),
  savePosition: (pos) => ipcRenderer.send('pip:save-position', pos),
  loadPosition: () => ipcRenderer.invoke('pip:load-position'),
  minimize: () => ipcRenderer.send('pip:minimize'),
  quit: () => ipcRenderer.send('pip:quit'),
});`,

    builder: `// electron-builder.json - Windows Packaging Specification
{
  "appId": "ai.pathpilot.pip",
  "productName": "Pip — AI Desktop Learning Companion",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "electron/**/*",
    "package.json"
  ],
  "extraMetadata": {
    "main": "electron/main.js"
  },
  "win": {
    "target": [
      { "target": "nsis", "arch": ["x64"] },
      { "target": "portable", "arch": ["x64"] }
    ],
    "requestedExecutionLevel": "asInvoker"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "shortcutName": "Pip AI Companion"
  }
}`,

    readme: `# Pip — AI Desktop Learning Companion (Windows Electron App)

## 1. Quick Start
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express backend + Vite)
npm run dev

# 3. In a second terminal on Windows, launch the Electron companion
npm run electron:dev
\`\`\`

## 2. Package Windows Installer (.exe)
\`\`\`bash
# Build production bundle and package Windows installer
npm run electron:build
\`\`\`
The generated setup installer will be in \`/release/Pip — AI Desktop Learning Companion Setup.exe\`
`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Package size={16} />
            </span>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Windows Native Application Deliverable
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Electron Architecture & Windows Packaging</h2>
          <p className="text-xs text-slate-400">
            Pip is engineered to run both natively on the Windows OS desktop and within the interactive preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            Electron + React 19 Ready
          </span>
        </div>
      </div>

      {/* Commands Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal size={16} className="text-purple-400" />
          Terminal Execution & Packaging Commands
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-500 mr-2"># 1. Run full stack dev</span>
              <span className="text-purple-300 font-bold">npm run dev</span>
            </div>
            <button
              onClick={() => copyToClipboard('npm run dev', 'cmd1')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {copiedKey === 'cmd1' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-500 mr-2"># 2. Launch Native Electron Companion</span>
              <span className="text-indigo-300 font-bold">npx electron electron/main.js</span>
            </div>
            <button
              onClick={() => copyToClipboard('npx electron electron/main.js', 'cmd2')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {copiedKey === 'cmd2' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-500 mr-2"># 3. Compile Windows Installer (.exe)</span>
              <span className="text-emerald-300 font-bold">npm run build && npx electron-builder --win</span>
            </div>
            <button
              onClick={() => copyToClipboard('npm run build && npx electron-builder --win', 'cmd3')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {copiedKey === 'cmd3' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs */}
      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'main', label: 'electron/main.js' },
                { id: 'preload', label: 'electron/preload.js' },
                { id: 'builder', label: 'electron-builder.json' },
                { id: 'readme', label: 'README.md' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  pipAudio.playClick();
                  setActiveFile(f.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeFile === f.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => copyToClipboard(CODE_SNIPPETS[activeFile], 'activeCode')}
            className="flex items-center gap-1 text-xs text-purple-300 hover:text-white px-3 py-1 rounded-lg bg-slate-900 border border-slate-800"
          >
            {copiedKey === 'activeCode' ? <Check size={13} /> : <Copy size={13} />}
            Copy Source
          </button>
        </div>

        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[380px]">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            {CODE_SNIPPETS[activeFile]}
          </pre>
        </div>
      </div>
    </div>
  );
};

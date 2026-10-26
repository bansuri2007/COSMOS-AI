const { contextBridge, ipcRenderer } = require('electron');

const api = {
  isElectron: true,
  platform: process.platform,

  moveWindow: (deltaX, deltaY) => {
    ipcRenderer.send('pip:move', { deltaX, deltaY });
  },

  setPosition: (x, y) => {
    ipcRenderer.send('pip:set-position', { x, y });
  },

  getScreenBounds: async () => {
    return await ipcRenderer.invoke('pip:get-bounds');
  },

  setAlwaysOnTop: (always) => {
    ipcRenderer.send('pip:toggle-always-on-top', always);
  },

  openExternal: (url) => {
    if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
      ipcRenderer.send('pip:open-external', url);
    }
  },

  openPathPilot: (customUrl) => {
    ipcRenderer.send('pip:open-pathpilot', customUrl);
  },

  savePreferences: async (prefs) => {
    return await ipcRenderer.invoke('pip:save-preferences', prefs);
  },

  loadPreferences: async () => {
    return await ipcRenderer.invoke('pip:load-preferences');
  },

  savePosition: (pos) => {
    ipcRenderer.send('pip:save-position', pos);
  },

  loadPosition: async () => {
    return await ipcRenderer.invoke('pip:load-position');
  },

  minimize: () => {
    ipcRenderer.send('pip:minimize');
  },

  hide: () => {
    ipcRenderer.send('pip:hide');
  },

  show: () => {
    ipcRenderer.send('pip:show');
  },

  quit: () => {
    ipcRenderer.send('pip:quit');
  },

  showNotification: (title, body) => {
    ipcRenderer.send('pip:show-notification', { title, body });
  },

  openHubWindow: (view) => {
    ipcRenderer.send('pip:open-hub-window', view);
  },

  onTrayAction: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('pip:tray-action', handler);
    return () => {
      ipcRenderer.removeListener('pip:tray-action', handler);
    };
  },

  onRoamCommand: (callback) => {
    const handler = (_event, coords) => callback(coords);
    ipcRenderer.on('pip:roam-to', handler);
    return () => {
      ipcRenderer.removeListener('pip:roam-to', handler);
    };
  },
};

contextBridge.exposeInMainWorld('pipDesktop', api);

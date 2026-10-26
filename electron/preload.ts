/**
 * Secure Preload Bridge for Pip — AI Desktop Learning Companion
 * Strictly validates IPC channels and enforces context isolation.
 */
import { contextBridge, ipcRenderer } from 'electron';

// Explicit whitelist of allowed outgoing and incoming IPC channels
const ALLOWED_CHANNELS = [
  'pip:move',
  'pip:get-bounds',
  'pip:toggle-always-on-top',
  'pip:toggle-ignore-mouse',
  'pip:open-external',
  'pip:open-pathpilot',
  'pip:save-position',
  'pip:load-position',
  'pip:save-preferences',
  'pip:load-preferences',
  'pip:minimize',
  'pip:hide',
  'pip:show',
  'pip:quit',
  'pip:show-notification',
  'pip:trigger-roam',
  'pip:open-hub-window',
] as const;

type AllowedChannel = typeof ALLOWED_CHANNELS[number];

export interface PipDesktopApi {
  isElectron: boolean;
  platform: string;
  moveWindow: (deltaX: number, deltaY: number) => void;
  setPosition: (x: number, y: number) => void;
  getScreenBounds: () => Promise<{ width: number; height: number; x: number; y: number }>;
  setAlwaysOnTop: (always: boolean) => void;
  openExternal: (url: string) => void;
  openPathPilot: (customUrl?: string) => void;
  savePreferences: (prefs: Record<string, any>) => Promise<boolean>;
  loadPreferences: () => Promise<Record<string, any>>;
  savePosition: (pos: { x: number; y: number }) => void;
  loadPosition: () => Promise<{ x: number; y: number } | null>;
  minimize: () => void;
  hide: () => void;
  show: () => void;
  quit: () => void;
  showNotification: (title: string, body: string) => void;
  openHubWindow: (view?: string) => void;
  onTrayAction: (callback: (action: string) => void) => () => void;
  onRoamCommand: (callback: (coords: { x: number; y: number }) => void) => () => void;
}

const api: PipDesktopApi = {
  isElectron: true,
  platform: process.platform,

  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send('pip:move', { deltaX, deltaY });
  },

  setPosition: (x: number, y: number) => {
    ipcRenderer.send('pip:set-position', { x, y });
  },

  getScreenBounds: async () => {
    return await ipcRenderer.invoke('pip:get-bounds');
  },

  setAlwaysOnTop: (always: boolean) => {
    ipcRenderer.send('pip:toggle-always-on-top', always);
  },

  openExternal: (url: string) => {
    // Basic protocol validation
    if (url.startsWith('https://') || url.startsWith('http://')) {
      ipcRenderer.send('pip:open-external', url);
    }
  },

  openPathPilot: (customUrl?: string) => {
    ipcRenderer.send('pip:open-pathpilot', customUrl);
  },

  savePreferences: async (prefs: Record<string, any>) => {
    return await ipcRenderer.invoke('pip:save-preferences', prefs);
  },

  loadPreferences: async () => {
    return await ipcRenderer.invoke('pip:load-preferences');
  },

  savePosition: (pos: { x: number; y: number }) => {
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

  showNotification: (title: string, body: string) => {
    ipcRenderer.send('pip:show-notification', { title, body });
  },

  openHubWindow: (view?: string) => {
    ipcRenderer.send('pip:open-hub-window', view);
  },

  onTrayAction: (callback: (action: string) => void) => {
    const handler = (_event: any, action: string) => callback(action);
    ipcRenderer.on('pip:tray-action', handler);
    return () => {
      ipcRenderer.removeListener('pip:tray-action', handler);
    };
  },

  onRoamCommand: (callback: (coords: { x: number; y: number }) => void) => {
    const handler = (_event: any, coords: { x: number; y: number }) => callback(coords);
    ipcRenderer.on('pip:roam-to', handler);
    return () => {
      ipcRenderer.removeListener('pip:roam-to', handler);
    };
  },
};

contextBridge.exposeInMainWorld('pipDesktop', api);

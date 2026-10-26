const { app, BrowserWindow, screen, ipcMain, shell, Tray, Menu, nativeImage, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let companionWindow = null;
let hubWindow = null;
let tray = null;
let isQuitting = false;

const userDataPath = app.getPath('userData');
const configFilePath = path.join(userDataPath, 'pip-settings.json');
const positionFilePath = path.join(userDataPath, 'pip-position.json');

const DEFAULT_SETTINGS = {
  roamingEnabled: true,
  roamingFrequencySeconds: 60,
  roamingSpeed: 'normal',
  characterScale: 1.0,
  speechPosition: 'top',
  soundEffects: true,
  animationsEnabled: true,
  reducedMotion: false,
  startWithWindows: false,
  rememberPosition: true,
  pathPilotUrl: 'https://learnova-intelligent-learning-classroom-ecosystem.ai.studio',
};

function readConfigFile() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to read config file:', err);
  }
  return DEFAULT_SETTINGS;
}

function writeConfigFile(data) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write config file:', err);
  }
}

function readPositionFile() {
  try {
    if (fs.existsSync(positionFilePath)) {
      const data = fs.readFileSync(positionFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read position file:', err);
  }
  return null;
}

function writePositionFile(pos) {
  try {
    fs.writeFileSync(positionFilePath, JSON.stringify(pos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write position file:', err);
  }
}

function createCompanionWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

  const windowWidth = 380;
  const windowHeight = 440;

  const savedPos = readPositionFile();
  let initialX = savedPos ? savedPos.x : Math.max(20, screenWidth - windowWidth - 40);
  let initialY = savedPos ? savedPos.y : Math.max(20, screenHeight - windowHeight - 40);

  initialX = Math.max(10, Math.min(initialX, screenWidth - windowWidth - 10));
  initialY = Math.max(10, Math.min(initialY, screenHeight - windowHeight - 10));

  companionWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round(initialX),
    y: Math.round(initialY),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  companionWindow.setAlwaysOnTop(true, 'screen-saver');

  const isDev = !app.isPackaged;
  if (isDev) {
    companionWindow.loadURL('http://localhost:3000?mode=companion');
  } else {
    companionWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { mode: 'companion' },
    });
  }

  companionWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  companionWindow.on('moved', () => {
    if (companionWindow) {
      const [x, y] = companionWindow.getPosition();
      writePositionFile({ x, y });
    }
  });

  companionWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      companionWindow.hide();
      return false;
    }
  });
}

function createHubWindow() {
  if (hubWindow) {
    if (hubWindow.isMinimized()) hubWindow.restore();
    hubWindow.focus();
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workArea;

  hubWindow = new BrowserWindow({
    width: Math.min(1280, Math.round(width * 0.9)),
    height: Math.min(840, Math.round(height * 0.9)),
    title: 'Pip Learning Hub — Study & Mastery Suite',
    center: true,
    backgroundColor: '#030712',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    hubWindow.loadURL('http://localhost:3000?mode=hub');
  } else {
    hubWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { mode: 'hub' },
    });
  }

  hubWindow.on('closed', () => {
    hubWindow = null;
  });
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('Pip — AI Desktop Learning Companion');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Pip Companion',
      click: () => {
        companionWindow && companionWindow.show();
        companionWindow && companionWindow.focus();
      },
    },
    {
      label: 'Hide Pip',
      click: () => companionWindow && companionWindow.hide(),
    },
    { type: 'separator' },
    {
      label: 'Open Pip Learning Hub',
      click: () => createHubWindow(),
    },
    {
      label: 'Open PathPilot AI Platform',
      click: () => {
        const settings = readConfigFile();
        shell.openExternal(settings.pathPilotUrl || 'https://learnova-intelligent-learning-classroom-ecosystem.ai.studio');
      },
    },
    { type: 'separator' },
    {
      label: 'Toggle Roaming On Desktop',
      click: () => {
        const settings = readConfigFile();
        const next = !settings.roamingEnabled;
        settings.roamingEnabled = next;
        writeConfigFile(settings);
        companionWindow && companionWindow.webContents.send('pip:tray-action', next ? 'roaming-on' : 'roaming-off');
      },
    },
    {
      label: 'Reset Mascot Position',
      click: () => {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workArea;
        companionWindow && companionWindow.setPosition(width - 360, height - 420, true);
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Pip',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (companionWindow && companionWindow.isVisible()) {
      companionWindow.focus();
    } else {
      companionWindow && companionWindow.show();
    }
  });
}

function setupIpc() {
  ipcMain.on('pip:move', (_event, { deltaX, deltaY }) => {
    if (companionWindow) {
      const [currX, currY] = companionWindow.getPosition();
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workArea;

      const nextX = Math.max(10, Math.min(currX + deltaX, width - 260));
      const nextY = Math.max(10, Math.min(currY + deltaY, height - 260));
      companionWindow.setPosition(Math.round(nextX), Math.round(nextY));
    }
  });

  ipcMain.on('pip:set-position', (_event, { x, y }) => {
    if (companionWindow) {
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workArea;
      const safeX = Math.max(10, Math.min(x, width - 300));
      const safeY = Math.max(10, Math.min(y, height - 320));
      companionWindow.setPosition(Math.round(safeX), Math.round(safeY), true);
    }
  });

  ipcMain.handle('pip:get-bounds', () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    return primaryDisplay.workArea;
  });

  ipcMain.on('pip:toggle-always-on-top', (_event, always) => {
    companionWindow && companionWindow.setAlwaysOnTop(Boolean(always), 'screen-saver');
  });

  ipcMain.on('pip:open-external', (_event, url) => {
    if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
      shell.openExternal(url);
    }
  });

  ipcMain.on('pip:open-pathpilot', (_event, customUrl) => {
    const settings = readConfigFile();
    const target = customUrl || settings.pathPilotUrl || 'https://learnova-intelligent-learning-classroom-ecosystem.ai.studio';
    shell.openExternal(target);
  });

  ipcMain.handle('pip:save-preferences', (_event, prefs) => {
    writeConfigFile(prefs);
    return true;
  });

  ipcMain.handle('pip:load-preferences', () => {
    return readConfigFile();
  });

  ipcMain.on('pip:save-position', (_event, pos) => {
    writePositionFile(pos);
  });

  ipcMain.handle('pip:load-position', () => {
    return readPositionFile();
  });

  ipcMain.on('pip:minimize', () => {
    companionWindow && companionWindow.minimize();
  });

  ipcMain.on('pip:hide', () => {
    companionWindow && companionWindow.hide();
  });

  ipcMain.on('pip:show', () => {
    companionWindow && companionWindow.show();
  });

  ipcMain.on('pip:quit', () => {
    isQuitting = true;
    app.quit();
  });

  ipcMain.on('pip:show-notification', (_event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });

  ipcMain.on('pip:open-hub-window', () => {
    createHubWindow();
  });
}

app.whenReady().then(() => {
  setupIpc();
  createCompanionWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createCompanionWindow();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep running in tray unless explicit quit
  }
});

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 700,
    minWidth: 760,
    minHeight: 560,
    backgroundColor: '#1e1e20',
    titleBarStyle: 'hiddenInset',
    frame: process.platform === 'darwin' ? true : false,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // decommenter pour debug
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Gestion des boutons de fenetre custom (Windows/Linux, sans barre de titre native)
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

// ---------- Historique des QR generes (fichier JSON local) ----------
const historyPath = path.join(app.getPath('userData'), 'history.json');

function readHistory() {
  try {
    return JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  } catch {
    return [];
  }
}

ipcMain.handle('history-get', () => readHistory());

ipcMain.handle('history-add', (event, entry) => {
  const history = readHistory();
  history.unshift(entry); // le plus recent en premier
  const trimmed = history.slice(0, 12); // on garde les 12 derniers
  fs.writeFileSync(historyPath, JSON.stringify(trimmed, null, 2));
  return trimmed;
});

ipcMain.handle('history-clear', () => {
  fs.writeFileSync(historyPath, JSON.stringify([]));
  return [];
});

// Sauvegarde du QR code (PNG) via boite de dialogue native
ipcMain.handle('save-png', async (event, dataUrl, suggestedName) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Enregistrer le QR code',
    defaultPath: suggestedName || 'qrcode.png',
    filters: [{ name: 'Image PNG', extensions: ['png'] }]
  });
  if (canceled || !filePath) return { ok: false };

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(filePath, base64, 'base64');
  return { ok: true, filePath };
});

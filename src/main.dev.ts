/* eslint global-require: off, no-console: off */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

// init node-side IPC handlers
import './ipc';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  const devMode =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  if (devMode) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // hide default menubar
  mainWindow.removeMenu();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    // set requests to have content-security-policy
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // avoid tampering devtools in dev
      if (
        devMode &&
        (details.url.startsWith('devtools://') ||
          details.url.startsWith('chrome-extension://'))
      ) {
        callback({
          responseHeaders: details.responseHeaders,
        });
        return;
      }

      // outside of devmode we can probably remove all the 'unsafe-inline', not
      // sure what the impact of that or the effort involved though.
      const loc = `localhost:${process.env.PORT || 1212}`;
      const csp = [
        `default-src 'none'`,
        `connect-src https://*.amazonaws.com http://${loc} ws://${loc} wss://app.nucleus.sh`,
        `style-src-elem file: 'unsafe-inline' https://fonts.googleapis.com`,
        `script-src 'unsafe-inline'`,
        `script-src-elem file: 'unsafe-inline' http://${loc}`,
        'font-src https://fonts.gstatic.com',
      ];

      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [csp.join('; ')],
        },
      });
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// disable navigation
app.on('web-contents-created', (_event, webContents) => {
  webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== 'https://example.com') {
      event.preventDefault();
    }
  });
});

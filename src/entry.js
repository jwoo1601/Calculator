const electron = require("electron");
const path = require("path");
const url = require("url");
const { app, BrowserWindow } = electron;

let winMain = null;

const createWindow = () => {
  winMain = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../public/index.html"),
      protocol: "file:",
      slashes: true
    });

  winMain.loadURL(startUrl);
  winMain.on("closed", () => {
    winMain = null;
  });

  winMain.webContents.openDevTools({ mode: "detach" });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (winMain === null) {
    createWindow();
  }
});

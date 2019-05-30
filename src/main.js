//@ts-ignore
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;
const ipcMain = electron.ipcMain;
function createWindow() {
	mainWindow = new BrowserWindow({ width: 800, height: 600 });
	const startUrl = process.env.NODE_ENV == "development" ? "http://localhost:3000" : url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	mainWindow.loadURL(startUrl);

	mainWindow.on('closed', function () {
		mainWindow = null;
	})
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on("button", function (event, args) {
	console.log("buttonCkicked");
});
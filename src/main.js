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
	if (process.env.NODE_ENV == "development") {
		/*async function start_react_scripts() {
			const spawn = require('react-dev-utils/crossSpawn');
			require("react-scripts/scripts/start")
		}
		start_react_scripts();*/
		mainWindow.loadURL("http://localhost:3000");
	} else {
		const startUrl = url.format({
			pathname: path.join(__dirname, '/../build/index.html'),
			protocol: 'file:',
			slashes: true
		});
		mainWindow.loadURL(startUrl);
	}
	//mainWindow.webContents.openDevTools();

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
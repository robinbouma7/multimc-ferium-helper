//include packages
const { app, BrowserWindow } = require('electron');
const path = require('path');

//class met info over een profile
//info krijg je van config.json van ferium
class profile {
	name;
	version;
	modloader;
	flodername;
	mods = [];
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			//if app is activated and there are no windows create one
			//this is for mac, explained below
			createWindow();
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		//close app if all windows are closed
		//exept when using mac (because mac apps normaly stay open in background)
		app.quit();
	}
})

const createWindow = () => {
	//create a window with size 800x600
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});
	//load index.html in that window
	win.loadFile('index.html');
}
//create a profile with these parameters
//name: name of the profile
//version: minecraft version
//modloder: forge, fabric, etc
//foldername: name of the instance folder
function createprofile(name, version, modloader, flodername) {

}
//switch to another profile
//name: name of the profile to switch to
function switchprofile(name) {

}
//delete a profile
//name: name of the profile to delete
function deleteprofile(name) {

}
//edit a profile, overwrites all the info with the info given
//name: name of the profile
//version: minecraft version
//modloder: forge, fabric, etc
//foldername: name of the instance folder
function editprofile(name, version, modloader, flodername) {

}
//add a mod to a profile
//type: modrinth, curseforge or github
//identifier: project id(modrinth, curseforge), mod name(modrinth) or repository name
function addmod(type, identifier) {

}
//removes a mod
//name: name of the mod
function removemod(name) {

}
//update all the mods in the current profile
function updatemods() {

}
//launch multimc
function launchmmc() {

}
//sets the path of multimc
//path: path to the folder where multimc.exe is located
function setmmcpath(path) {

}
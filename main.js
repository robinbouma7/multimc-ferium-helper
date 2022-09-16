//include packages
const { app, BrowserWindow } = require('electron');
const path = require('path');
//xml parser
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
//filesystem
const fs = require('fs');

//class met info over een profile
//info krijg je van config.json van ferium
//name: naam van het profiel
//version: minecraft versie
//modloader: type modloader (fabric, forge, etc.)
//foldername: naam van de folder in de multimc instances folder
//mods: een array van Mod classes
class Profile {
	name;
	version;
	modloader;
	flodername;
	mods;
}
//class met info over mods
//name: naam van de mod
//identifier: project id(modrinth, curseforge), mod naam(modrinth) of repository naam
//type: cusreforge, modrinth of github
class Mod {
	name;
	identifier;
	type;
}
var mmcpath;
var profiles;

app.whenReady().then(() => {
	createWindow();

	loadxml("./config.xml");

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
//load confix xml file
//path: path naar xml bestand
function loadxml(path) {
	var data;
	console.log(`xml file path: ${path}`);
	//zet de data in bestand over naar file
	var file = fs.readFileSync(path, "utf8");
	//parse xml data uit file
	parser.parseString(file, function(error, result) {
        if(error === null) {
            console.log(result);
        }
        else {
            console.log(error);
			return;
        }
        data = result
    });
	//verwerk de data uit het xml bestand
	setmmcpath(data.info.mmcpath);
	console.log(`number of profiles ${data.info.profilenum}`);
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
	console.log(`multimc path set to ${path}`);
	mmcpath = path;
}
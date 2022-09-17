//include packages
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
//xml parser
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var builder = new xml2js.Builder();
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
var mmcexepath;
var mmcpath;
var profiles;
var win;
var firstopen;
var xml;

app.whenReady().then(() => {

	//preload command een functie aanwijzen
	ipcMain.on('launchmmc', launchmmc);

	loadxml("./config.xml");

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
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			enableRemoteModule: true
		}
	});
	//load index.html in that window
	if(firstopen) {
		win.loadFile('setup.html');
	}
	else {
		win.loadFile('index.html');
	}
	console.log("window created")
}
ipcMain.on('submitsetup', function(event, path) {
	console.log(`multimc path: ${path}`);
	mmcexepath = path;

	//remove the last 11 characters from the string to remove the exe name
	mmcpath = mmcexepath.substring(0, mmcexepath.length - 11);
	console.log(`console path: ${mmcpath}`);

	xml.info.mmcpath = mmcpath;
	xml.info.mmcexepath = mmcexepath;

	updatexml(xml, "./config.xml")

	win.loadFile("index.html");
});
//first setup, to set path and things
function setup() {

}
//load confix xml file
//path: path naar xml bestand
function loadxml(path) {
	
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
        xml = result
    });
	//verwerk de data uit het xml bestand
	if(xml.info.mmcpath == undefined || xml.info.mmcexepath == undefined) {
		console.log("xml file is incorrect")
	}
	else if(xml.info.mmcpath == "" || xml.info.mmcexepath == "") {
		firstopen = true;
		console.log("xml file has empty options");
	}
	else {
		firstopen = false;
		mmcexepath = xml.info.mmcexepath;
		setmmcpath(xml.info.mmcpath);
		console.log(`exe path: ${xml.info.mmcexepath}`);
		console.log(`number of profiles ${xml.info.profilenum}`);
	}
	
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
	var cp = require("child_process");
	console.log(`executing ${mmcexepath}`);
	//launch multimc
	cp.exec(mmcexepath.toString(), function (err, stdout, stderr) {
		
        if (err) {
        	console.error(err);
        	return;
		}
		console.log(stdout);
	})
	//wachten om multimc tijd te geven om te launchen
	sleep(5000);
	//programma afsluiten
	app.quit();
}

//sets the path of multimc
//path: path to the folder where multimc.exe is located
function setmmcpath(path) {
	console.log(`multimc path set to ${path}`);
	mmcpath = path;
}
//wacht voor een bepaalde tijd
//ms: aantal miliseconden om te wachten
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//update an xml file
//xml: the parsed xml object
//path: the path to the xml file to edit
function updatexml(xml, path) {
	var xmldata = builder.buildObject(xml);
	fs.writeFile(path, xmldata, function(err, data) {
		if (err) console.log(err);

      	console.log("successfully updated xml");
	});
}
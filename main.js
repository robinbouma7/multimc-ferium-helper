//include packages
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
//xml parser
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var builder = new xml2js.Builder();
//cfg parser
var ConfigIniParser = require("config-ini-parser").ConfigIniParser;
var cfgparser = [];
//andere includes
const fs = require('fs');
const os = require('os');
const cp = require("child_process");
const path = require('path');
var events = require('events');
var event = new events.EventEmitter();

//class voor instances
//name: naam van de instance
//foldername: naam van de folder
//version: minecraft versie
//modloader: type modloader
//modloaderversion: versie van de modloader
//profile: de profile class als hij er een heeft
class Instance {
	name;
	foldername;
	version;
	modloader;
	modloaderversion;
	iconpath;
	profile;
}
//class met info over een profile
//info krijg je van config.json van ferium
//name: naam van het profiel
//version: minecraft versie
//modloader: type modloader (fabric, forge, etc.)
//mods: een array van Mod classes
class Profile {
	name;
	version;
	modloader;
	mods = [];
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
var instances = [];
var win;
var firstopen;
var xml;
var instancefolders = [];
var configpath;
var instancegot = function () {
	//console.log(instancefolders);
	var i = 0;
	while (i < instancefolders.length) {
		//declare class
		instances[i] = new Instance;
		//set the instance folder
		instances[i].foldername = instancefolders[i];
		//get instance name
		var instancecfg = fs.readFileSync((mmcpath + "instances/" +instancefolders[i] + "/instance.cfg").toString(), "utf8");
		cfgparser[i] = new ConfigIniParser();
		cfgparser[i].parse(instancecfg);
		var instancename = cfgparser[i].get(null, "name");
		instances[i].name = instancename;
		instances[i].iconpath = (mmcpath + "instances/" +instancefolders[i] + "/.minecraft/icon.png");


		//var instancedata = require((mmcpath + "instances/" +instancefolders[i] + "/mmc-pack.json").toString());
		var instancedata = JSON.parse(fs.readFileSync((mmcpath + "instances/" +instancefolders[i] + "/mmc-pack.json").toString(), 'utf8'));
		for(var j = 0; j < instancedata.components.length; j++) {
			if(instancedata.components[j].cachedName == "Minecraft") {
				instances[i].version = instancedata.components[j].version;
			}
			else if(instancedata.components[j].cachedName == "Fabric Loader") {
				instances[i].modloader = "fabric";
				instances[i].modloaderversion = instancedata.components[j].version;
			}
			else if(instancedata.components[j].cachedName == "Forge") {
				instances[i].modloader = "forge";
				instances[i].modloaderversion = instancedata.components[j].version;
			}
		}
		//console.log(instancedata);
		i++;
	}
	var feriumdata = JSON.parse(fs.readFileSync(configpath.toString(), 'utf8'));
	//console.log(feriumdata.profiles.length);
	//console.log(instances.length);
	for(var i = 0; i < instances.length; i++) {
		for(var j = 0; j < feriumdata.profiles.length; j++) {
			instancepath = path.resolve((mmcpath + "instances/" + instances[i].foldername + "/.minecraft/mods").toString());
  			feriumpath = path.resolve(feriumdata.profiles[j].output_dir);
			if(instancepath.toLowerCase() == feriumpath.toLowerCase()) {
				console.log(`instance  with name "${instances[i].name}" has profile`);
				instances[i].profile = new Profile;
				instances[i].profile.name = feriumdata.profiles[j].name;
				instances[i].profile.version = feriumdata.profiles[j].game_version;
				instances[i].profile.modloader = feriumdata.profiles[j].mod_loader;
				for(var k = 0; k < feriumdata.profiles[j].mods.length; k++) {
					instances[i].profile.mods[k] = new Mod;
					instances[i].profile.mods[k].name = feriumdata.profiles[j].mods[k].name;
					if(feriumdata.profiles[j].mods[k].identifier.hasOwnProperty("CurseForgeProject")) {
						instances[i].profile.mods[k].type = "curseforge";
						instances[i].profile.mods[k].identifier = feriumdata.profiles[j].mods[k].identifier.CurseForgeProject;
					}
					else if(feriumdata.profiles[j].mods[k].identifier.hasOwnProperty("ModrinthProject")) {
						instances[i].profile.mods[k].type = "modrinth";
						instances[i].profile.mods[k].identifier = feriumdata.profiles[j].mods[k].identifier.ModrinthProject;
					}
					else if(feriumdata.profiles[j].mods[k].identifier.hasOwnProperty("GithubProject")) {
						instances[i].profile.mods[k].type = "github";
						instances[i].profile.mods[k].identifier = feriumdata.profiles[j].mods[k].identifier.GithubProject;
					}

					
				}
				//console.log(instances[i].profile);
			}
		}

	}
	
	//console.log(instances);
}
function sendinstances() {
	return instances;
}
app.whenReady().then(() => {
	//preload command een functie aanwijzen
	ipcMain.on('launchmmc', launchmmc);
	ipcMain.handle('getinstances', sendinstances)

	loadxml("./config.xml");
	
	readinstances();

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
		win.loadFile('instances.html');
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
function getinstances(instancefolder) { 
	console.log(`instances folder: ${instancefolder}`);

	fs.readdir(instancefolder, function(err, files) {
		if (err) {
			console.log(err);
		}
		else {
			files.map(function(f) {
				return instancefolder + f;
			});
			var i = 0;
			while (i < files.length) {
				if (files[i] == "_LAUNCHER_TEMP" || files[i] == "_MMC_TEMP" || files[i] == "instgroups.json") {
					files.splice(i, 1);
				} else {
				  i++;
				}
			  }
			instancefolders = files;
			event.emit("gotinstances");
		}
	});
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
		firstopen = true;
		console.log("xml file is missing options");
	}
	else if(xml.info.mmcpath == "" || xml.info.mmcexepath == "") {
		firstopen = true;
		console.log("xml file has empty options");
	}
	else {
		if(xml.info.configpath == undefined || xml.info.configpath == "") {
			xml.info.configpath = (os.homedir() + "\\.config\\ferium\\config.json").toString();
			updatexml(xml, "./config.xml");
		}
		firstopen = false;
		mmcexepath = xml.info.mmcexepath;
		setmmcpath(xml.info.mmcpath);
		configpath = xml.info.configpath;
		console.log(`exe path: ${xml.info.mmcexepath}`);
		console.log(`number of profiles ${xml.info.profilenum}`);
	}
	
}
//read the instances in the instances folder
function readinstances() {
	var instancefolder = (mmcpath + "instances\\").toString();
	
	getinstances(instancefolder);
	event.on("gotinstances", instancegot);
}

//create a profile with these parameters
//name: name of the profile
//version: minecraft version
//modloder: forge, fabric, etc
//foldername: name of the instance folder
ipcMain.on('createprofile', function(event, name, version, modloader, flodername) {

});
//edit a profile, overwrites all the info with the info given
//name: name of the profile
//version: minecraft version
//modloder: forge, fabric, etc
//foldername: name of the instance folder
ipcMain.on('editprofile', function(event, name, version, modloader, flodername) {

});

//switch to another profile
//name: name of the profile to switch to
ipcMain.on('switchprofile', function(event, name) {
	//spawn een process met het command en launch arguments
	var command = cp.spawn("ferium profile switch", [`--profile-name ${name}`]);

	//als het process data output dat naar de console loggen
	command.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	//als het programma een error heeft dat naar de console sturen
	command.stderr.on('data', (data) => {
		console.error(data.toString());
	});
	//zeggen als het programma afsluit
	command.on('exit', (code) => {
		console.log(`Child exited with code ${code}`);
	});
	console.log("switched profile");
});

//delete a profile
//name: name of the profile to delete
ipcMain.on('deleteprofile', function(event, name) {

});

//add a mod to a profile
//type: modrinth, curseforge or github
//identifier: project id(modrinth, curseforge), mod name(modrinth) or repository name
ipcMain.on('addmod', function(event, type, identifier) {

});

//removes a mod
//name: name of the mod
ipcMain.on('addremovemod', function(event, name) {

});

//update all the mods in the current profile
ipcMain.on('updatemods', function(event) {
	
});

//launch multimc
function launchmmc() {
	//TODO: add launch argument to start the instance
	
	console.log(`executing ${mmcexepath}`);
	//launch multimc
	cp.exec(mmcexepath.toString(), function (err, stdout, stderr) {
		
        if (err) {
        	console.error(err);
        	return;
		}
		console.log(stdout);
	});
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
ipcMain.on('closeapp', function(event) {
	app.quit();
});
const { contextBridge, ipcRenderer } = require("electron");

//code for browser to communicate with main nodejs
window.addEventListener('DOMContentLoaded', () => {
	//run when html is loaded
	const replaceText = (selector, text) => {
		//replace text in an element where the id = selector
		const element = document.getElementById(selector);
		if (element) {
			//replace the elements text with the one given
			element.innerText = text;
		}
	}

	for (const dependency of ['chrome', 'node', 'electron']) {
		//get the version numbers for crome, node and elecron and fill them into the html file
		replaceText(`${dependency}-version`, process.versions[dependency]);
	}
});
//functies van main exposen zodat je ze kan runnen in de renderer
contextBridge.exposeInMainWorld('electronAPI', {
    launchmmc: () => ipcRenderer.send("launchmmc"),
	submitsetup: (mmcpath, ultimmc) => ipcRenderer.send("submitsetup", mmcpath, ultimmc)
});
const launchmmc = document.getElementById('launchmmc');
var addmodbutton = [];
var editinstancebutton = [];
var saveinstancebutton = [];
var createinstancebutton = [];

launchmmc.addEventListener("click", async () => {
    window.electronAPI.launchmmc();
    setTimeout(function () {
        window.electronAPI.closeapp();
    }, 5000);
});
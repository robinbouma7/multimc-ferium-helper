const launchmmc = document.getElementById('launchmmc');


createinstanceelements();



launchmmc.addEventListener("click", async () => {
    window.electronAPI.launchmmc();
    setTimeout(function () {
        window.electronAPI.closeapp();
    }, 5000);
});

async function createinstanceelements() {
    var instanceclass = [];
    instanceclass = await window.electronAPI.getinstances();
    console.log(instanceclass);
}
function addmod() {

}
function editprofile() {

}
function saveprofile() {

}
function launchinstance() {

}
function createprofile() {

}
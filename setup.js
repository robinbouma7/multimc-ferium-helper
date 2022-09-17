const submitbutton = document.getElementById('submitbutton');

document.getElementById("warntext").style.visibility = "hidden";
document.getElementById("warntext").style.color = "red";

submitbutton.addEventListener("click", async () => {
    if(document.getElementById("multimcpath").value == undefined || document.getElementById("multimcpath").value == "") {
        document.getElementById("warntext").style.visibility = "visible";
    }
    else {
        window.electronAPI.submitsetup(document.getElementById("multimcpath").files[0].path);
    }
    
});
const submitbutton = document.getElementById('submitbutton');

submitbutton.addEventListener("click", async () => {
    window.electronAPI.submitsetup(document.getElementById("multimcpath").files[0].path);
});
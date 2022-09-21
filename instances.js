

launchmmc.addEventListener("click", async () => {
    window.electronAPI.launchmmc();
    setTimeout(function () {
        window.electronAPI.closeapp();
    }, 5000);
});
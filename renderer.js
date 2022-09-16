//browser side code

//launch m,c element
const launchmmc = document.getElementById('launchmmc');

launchmmc.addEventListener("click", async () => {
    window.electronAPI.launchmmc();
});
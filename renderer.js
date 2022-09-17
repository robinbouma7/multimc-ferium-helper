//browser side code

//launch mmc element
const launchmmc = document.getElementById('launchmmc');

//je moet het zo doen, je kan niet een functie van hier runnen vanaf html
launchmmc.addEventListener("click", async () => {
    window.electronAPI.launchmmc();
});
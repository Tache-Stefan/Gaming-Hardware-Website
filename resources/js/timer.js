document.addEventListener("DOMContentLoaded", function () {
    const timerElem = document.getElementById("timer-oferta");

    if (!timerElem) return;

    const dataFinalizare = new Date(timerElem.getAttribute("data-final"));

    function updateTimer() {
        const acum = new Date();
        const diffMs = dataFinalizare - acum;

        if (diffMs <= 0) {
            timerElem.innerText = "Oferta a expirat!";
            document.getElementById("anunt-oferta")?.remove();
            location.reload();
            return;
        }

        const secunde = Math.floor((diffMs / 1000) % 60);
        const minute = Math.floor((diffMs / (1000 * 60)) % 60);
        const ore = Math.floor(diffMs / (1000 * 60 * 60));

        timerElem.innerText = `Timp rămas: ${ore}h ${minute}m ${secunde}s`;

        if (diffMs <= 10 * 1000) {
            timerElem.style.color = "red";
            timerElem.style.fontWeight = "bold";
            timerElem.classList.add("pulse-timer");
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Prüfen, ob schon ein Token existiert, sonst einen generieren
    let token = localStorage.getItem("browser_token");
    if (!token) {
        token = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("browser_token", token);
    }

    // 2. An die API senden
    fetch("https://simonlovesplanes.de/api/ben/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cookie: token })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Antwort vom Server:", data);
    })
    .catch(error => {
        console.error("Fehler beim Senden:", error);
    });
});
// ---------- Klick-Zähler ----------
let count = 0;
const counterEl = document.getElementById("counter");

// Checkbox und das Element mit der Klasse "trans" auswählen
const transElements = document.querySelector('.trans');

document.getElementById("counter-btn").addEventListener("click", () => {
  count++;
  counterEl.textContent = count;
});

// ---------- Todo-Liste ----------
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.textContent = text;
  // Klick = erledigt / nicht erledigt
  li.addEventListener("click", () => li.classList.toggle("done"));
  todoList.appendChild(li);

  todoInput.value = "";
});

// ---------- Zufallsspruch ----------
// Füg gerne eigene Sprüche hinzu!
const quotes = [
  "„Funktioniert auf meinem Rechner.“",
  "„Wer hat den main-Branch kaputt gemacht?“",
  "„Ich hab nur eine Zeile geändert.“",
  "„git push --force löst alle Probleme.“ (Nein.)",
  "„Merge-Konflikte sind nur Gespräche, die man nicht geführt hat.“",
];

document.getElementById("quote-btn").addEventListener("click", () => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quote").textContent = random;
});

// ---------- Geheimnis ----------
const secretBtn = document.getElementById("secret-btn");

secretBtn.addEventListener("click", () => {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");
});



// Checkbox und alle .trans-Elemente korrekt auswählen
const toggleCheckbox = document.querySelector('.toggle input[type="checkbox"]');

// Die Trans-Pride-Farben (Blau -> Rosa -> Weiß -> Rosa)
const transColors = ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8'];
let currentIndex = 0;
let colorInterval = null; // Speichert den Timer

// Funktion, die die Farbe wechselt
function startColorLoop() {
  if (colorInterval) return;

  colorInterval = setInterval(() => {
    const currentColor = transColors[currentIndex];
    
    // Alle .trans Elemente durchgehen und Textfarbe setzen
    document.querySelectorAll('.trans').forEach(element => {
      element.style.color = currentColor;
    });
    
    currentIndex = (currentIndex + 1) % transColors.length;
  }, 200); // alle 0.2 Sekunden
}

// Funktion, die den Farbwechsel stoppt und die Farbe zurücksetzt
function stopColorLoop() {
  clearInterval(colorInterval);
  colorInterval = null;
  
  document.querySelectorAll('.trans').forEach(element => {
    element.style.color = ''; // Setzt es auf das normale CSS zurück
  });
}

// Auf das Umschalten des Toggles reagieren (Hintergrundbild + Farbloop)
if (toggleCheckbox) {
  toggleCheckbox.addEventListener('change', function() {
    const transElements = document.querySelectorAll('.trans');
    
    if (this.checked) {
      // Wenn der Toggle AN ist: Hintergrundbild für alle .trans setzen
      transElements.forEach(element => {
        element.style.backgroundImage = 'url("trans.jpg")';
      });
      startColorLoop(); // Startet den Farbloop
    } else {
      // Wenn der Toggle AUS ist: Hintergrundbild entfernen
      transElements.forEach(element => {
        element.style.backgroundImage = 'none';
      });
      stopColorLoop();  // Stoppt den Farbloop
    }
  });

  // Falls der Toggle beim Laden der Seite schon an ist:
  if (toggleCheckbox.checked) {
    document.querySelectorAll('.trans').forEach(element => {
      element.style.backgroundImage = 'url("trans.jpg")';
    });
    startColorLoop();
  }
}
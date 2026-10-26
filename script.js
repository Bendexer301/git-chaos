// ---------- Klick-Zähler ----------
let count = 0;
const counterEl = document.getElementById("counter");

// Checkbox und das Element mit der Klasse "trans" auswählen
const toggleCheckbox = document.querySelector('.toggle input[type="checkbox"]');
const transElement = document.querySelector('.trans');

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


// Wir lauschen auf Veränderungen des Zustands
toggleCheckbox.addEventListener('change', function() {
  if (this.checked) {
    // Wenn der Toggle AN ist: Hintergrundbild setzen
    transElement.style.backgroundImage = 'url("trans.jpg")';
  } else {
    // Wenn der Toggle AUS ist: Hintergrundbild wieder entfernen
    transElement.style.backgroundImage = 'none';
  }
});
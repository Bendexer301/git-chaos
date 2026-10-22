// ---------- Klick-Zähler ----------
let count = 0;
const counterEl = document.getElementById("counter");

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

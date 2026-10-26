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

// ---------- Trading Simulator ----------
const marketPrices = {
  ALPHA: 124.5,
  BETA: 82.3,
  GAMMA: 210.7,
  DELTA: 58.9,
  BEN: 999.99,
};

const marketHistory = {
  ALPHA: [118, 121, 119, 123, 124, 126],
  BETA: [80, 81, 79, 82, 83, 82],
  GAMMA: [205, 208, 210, 212, 214, 211],
  DELTA: [55, 57, 56, 58, 60, 58],
  BEN: [900, 930, 980, 1010, 995, 1000],
};

const tradingState = {
  cash: 10000,
  holdings: {
    ALPHA: 2,
    BETA: 1,
  },
};

const tradeSymbolEl = document.getElementById("trade-symbol");
const tradeAmountEl = document.getElementById("trade-amount");
const marketPriceEl = document.getElementById("market-price");
const portfolioValueEl = document.getElementById("portfolio-value");
const tradeMessageEl = document.getElementById("trade-message");
const portfolioListEl = document.getElementById("portfolio-list");
const chartLineEl = document.getElementById("chart-line");
const chartFillEl = document.getElementById("chart-fill");
const chartSymbolLabelEl = document.getElementById("chart-symbol-label");
const tickerBricksEl = document.getElementById("ticker-bricks");

const formatCurrency = (value) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

function renderChart() {
  const symbol = tradeSymbolEl.value;
  const values = marketHistory[symbol] || [marketPrices[symbol]];
  const width = 320;
  const height = 120;
  const padding = 12;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = height - padding - ((value - min) / spread) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  chartLineEl.setAttribute("points", points);
  chartFillEl.setAttribute("points", `${points} ${width - padding},${height - padding} ${padding},${height - padding}`);
  chartSymbolLabelEl.textContent = symbol;
}

function renderBricks() {
  const bricks = Object.entries(marketPrices)
    .map(([symbol, price]) => {
      const statusClass = price >= (marketHistory[symbol]?.at(-2) ?? price) ? "up" : "down";
      return `
        <div class="brick ${statusClass}">
          <span class="brick-name">${symbol}</span>
          <strong>${formatCurrency(price)}</strong>
        </div>
      `;
    })
    .join("");

  tickerBricksEl.innerHTML = bricks;
}

function updateMarketDisplay() {
  const symbol = tradeSymbolEl.value;
  marketPriceEl.textContent = formatCurrency(marketPrices[symbol]);
  renderChart();
  renderBricks();
}

function calculatePortfolioValue() {
  const positionValue = Object.entries(tradingState.holdings).reduce((total, [symbol, shares]) => {
    return total + shares * marketPrices[symbol];
  }, 0);

  return tradingState.cash + positionValue;
}

function renderPortfolioList() {
  const entries = Object.entries(tradingState.holdings);

  if (!entries.length) {
    portfolioListEl.innerHTML = "<li>Keine Positionen im Portfolio.</li>";
    return;
  }

  portfolioListEl.innerHTML = entries
    .map(([symbol, shares]) => {
      const value = shares * marketPrices[symbol];
      return `<li><strong>${symbol}</strong> · ${shares} Stück · ${formatCurrency(value)}</li>`;
    })
    .join("");
}

function renderTradingState() {
  updateMarketDisplay();
  portfolioValueEl.textContent = formatCurrency(calculatePortfolioValue());
  tradeMessageEl.textContent = `Guthaben: ${formatCurrency(tradingState.cash)}`;
  renderPortfolioList();
}

function buyShares() {
  const symbol = tradeSymbolEl.value;
  const sharesToBuy = Number(tradeAmountEl.value);

  if (!sharesToBuy || sharesToBuy < 1) {
    tradeMessageEl.textContent = "Bitte gib eine gültige Menge ein.";
    return;
  }

  const totalCost = sharesToBuy * marketPrices[symbol];

  if (totalCost > tradingState.cash) {
    tradeMessageEl.textContent = `Zu wenig Guthaben für ${sharesToBuy} ${symbol}.`;
    return;
  }

  tradingState.cash -= totalCost;
  tradingState.holdings[symbol] = (tradingState.holdings[symbol] || 0) + sharesToBuy;
  tradeMessageEl.textContent = `${sharesToBuy} ${symbol} gekauft!`;
  renderTradingState();
}

function sellShares() {
  const symbol = tradeSymbolEl.value;
  const sharesToSell = Number(tradeAmountEl.value);

  if (!sharesToSell || sharesToSell < 1) {
    tradeMessageEl.textContent = "Bitte gib eine gültige Menge ein.";
    return;
  }

  const currentHolding = tradingState.holdings[symbol] || 0;

  if (sharesToSell > currentHolding) {
    tradeMessageEl.textContent = `Du hast nicht genug ${symbol}.`;
    return;
  }

  const totalValue = sharesToSell * marketPrices[symbol];
  tradingState.cash += totalValue;
  tradingState.holdings[symbol] -= sharesToSell;

  if (tradingState.holdings[symbol] <= 0) {
    delete tradingState.holdings[symbol];
  }

  tradeMessageEl.textContent = `${sharesToSell} ${symbol} verkauft!`;
  renderTradingState();
}

tradeSymbolEl.addEventListener("change", updateMarketDisplay);
document.getElementById("buy-btn").addEventListener("click", buyShares);
document.getElementById("sell-btn").addEventListener("click", sellShares);

setInterval(() => {
  Object.keys(marketPrices).forEach((symbol) => {
    const drift = (Math.random() - 0.5) * 12;
    marketPrices[symbol] = Math.max(10, marketPrices[symbol] + drift);
    marketHistory[symbol] = [...(marketHistory[symbol] || [marketPrices[symbol]]), marketPrices[symbol]].slice(-16);
  });

  renderTradingState();
}, 4000);

renderTradingState();

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
// ---------- Geheimnis ----------
const secretBtn = document.getElementById("secret-btn");

secretBtn.addEventListener("click", () => {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");
});

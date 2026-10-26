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
  li.addEventListener("click", () => li.classList.toggle("done"));
  todoList.appendChild(li);

  todoInput.value = "";
});

// ---------- Zufallsspruch ----------
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
  OOF: 64.2,
  SKIBIDI: 772.8,
  RIZZLER: 188.4,
  BINGE: 211.1,
  CHAD: 440.5,
  GOOF: 91.7,
  WHEEZE: 31.5,
};

const marketSupply = {
  ALPHA: 220,
  BETA: 180,
  GAMMA: 160,
  DELTA: 250,
  BEN: 90,
  OOF: 160,
  SKIBIDI: 70,
  RIZZLER: 120,
  BINGE: 110,
  CHAD: 95,
  GOOF: 170,
  WHEEZE: 210,
};

const marketHistory = Object.fromEntries(
  Object.entries(marketPrices).map(([symbol, price]) => [symbol, [price * 0.9, price * 0.95, price]])
);

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
const leaderboardListEl = document.getElementById("leaderboard-list");
const marketClockEl = document.getElementById("market-clock");
const battleNameInput = document.getElementById("battle-name");
const battleJoinBtn = document.getElementById("battle-join-btn");
const battlePlayerNameEl = document.getElementById("battle-player-name");
const battlePlayerScoreEl = document.getElementById("battle-player-score");
const playerRankingsEl = document.getElementById("player-rankings");
const stockCapEl = document.getElementById("stock-cap");

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

  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y = height - padding - ((value - min) / spread) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  chartLineEl.setAttribute("points", points);
  chartFillEl.setAttribute(
    "points",
    `${points} ${width - padding},${height - padding} ${padding},${height - padding}`
  );
  chartSymbolLabelEl.textContent = symbol;
}

function renderBricks() {
  const bricks = Object.entries(marketPrices)
    .map(([symbol, price]) => {
      const previous = marketHistory[symbol]?.at(-2) ?? price;
      const statusClass = price >= previous ? "up" : "down";

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

function renderLeaderboard() {
  const ranked = Object.entries(marketPrices)
    .map(([symbol, price]) => ({ symbol, price }))
    .sort((a, b) => b.price - a.price);

  leaderboardListEl.innerHTML = ranked
    .slice(0, 8)
    .map((entry, index) => `
      <li>
        <span>#${index + 1} ${entry.symbol}</span>
        <strong>${formatCurrency(entry.price)}</strong>
      </li>
    `)
    .join("");
}

function getBattleBoard() {
  try {
    const raw = localStorage.getItem("git-chaos-market-battle-board");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveBattleBoard(board) {
  localStorage.setItem("git-chaos-market-battle-board", JSON.stringify(board));
}

function getPlayerNetWorth(playerEntry) {
  const holdings = playerEntry?.holdings || {};
  const positionValue = Object.entries(holdings).reduce((total, [symbol, shares]) => {
    return total + Number(shares || 0) * (marketPrices[symbol] || 0);
  }, 0);

  return Number(playerEntry?.cash || 0) + positionValue;
}

function getGlobalSharesForSymbol(symbol) {
  return getBattleBoard().reduce((total, player) => {
    return total + Number(player?.holdings?.[symbol] || 0);
  }, 0);
}

function renderPlayerRankings() {
  const board = getBattleBoard();
  const activeName = (battleNameInput.value || "Ben").trim() || "Ben";
  const normalized = board
    .map((player) => ({
      name: player.name || "Unknown",
      cash: Number(player.cash || 0),
      holdings: player.holdings || {},
      worth: getPlayerNetWorth(player),
    }))
    .filter((player) => player.name && player.name !== "")
    .sort((a, b) => b.worth - a.worth);

  const activeEntry = normalized.find((player) => player.name.toLowerCase() === activeName.toLowerCase());
  if (!activeEntry) {
    const starter = { name: activeName, cash: tradingState.cash, holdings: { ...tradingState.holdings }, worth: calculatePortfolioValue() };
    normalized.push(starter);
  }

  const sortedBoard = normalized.sort((a, b) => b.worth - a.worth);
  const currentPlayer = sortedBoard.find((player) => player.name.toLowerCase() === activeName.toLowerCase()) || sortedBoard[0];

  battlePlayerNameEl.textContent = currentPlayer ? currentPlayer.name : activeName;
  battlePlayerScoreEl.textContent = formatCurrency(currentPlayer ? currentPlayer.worth : calculatePortfolioValue());

  playerRankingsEl.innerHTML = sortedBoard
    .slice(0, 6)
    .map((player, index) => `
      <li>
        <span>#${index + 1} ${player.name}</span>
        <strong>${formatCurrency(player.worth)}</strong>
      </li>
    `)
    .join("");

  const totalStock = Object.values(marketSupply).reduce((total, amount) => total + amount, 0);
  stockCapEl.textContent = `Limited Stock · ${totalStock} cap`;
}

function syncCurrentPlayerToBoard() {
  const board = getBattleBoard();
  const activeName = (battleNameInput.value || "Ben").trim() || "Ben";
  const existingIndex = board.findIndex((player) => (player.name || "").toLowerCase() === activeName.toLowerCase());
  const entry = {
    name: activeName,
    cash: tradingState.cash,
    holdings: { ...tradingState.holdings },
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    board[existingIndex] = entry;
  } else {
    board.push(entry);
  }

  saveBattleBoard(board.sort((a, b) => getPlayerNetWorth(b) - getPlayerNetWorth(a)));
  localStorage.setItem("git-chaos-battle-name", activeName);
}

function populateTradeOptions() {
  const options = Object.keys(marketPrices)
    .map((symbol) => `<option value="${symbol}">${symbol}</option>`)
    .join("");

  tradeSymbolEl.innerHTML = options;
  tradeSymbolEl.value = "BEN";
}

function updateMarketDisplay() {
  const symbol = tradeSymbolEl.value;
  marketPriceEl.textContent = formatCurrency(marketPrices[symbol]);
  renderChart();
  renderBricks();
  renderLeaderboard();
  renderPlayerRankings();
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
  syncCurrentPlayerToBoard();
  renderPlayerRankings();
}

function buyShares() {
  const symbol = tradeSymbolEl.value;
  const sharesToBuy = Number(tradeAmountEl.value);

  if (!sharesToBuy || sharesToBuy < 1) {
    tradeMessageEl.textContent = "Bitte gib eine gültige Menge ein.";
    return;
  }

  const globalHeld = getGlobalSharesForSymbol(symbol);
  const supplyLimit = marketSupply[symbol] ?? 9999;
  const availableStock = Math.max(0, supplyLimit - globalHeld);

  if (sharesToBuy > availableStock) {
    tradeMessageEl.textContent = `${symbol} hat nur noch ${availableStock} freie Coins im Market.`;
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

battleJoinBtn.addEventListener("click", () => {
  const cleanName = (battleNameInput.value || "Ben").trim() || "Ben";
  battleNameInput.value = cleanName;
  localStorage.setItem("git-chaos-battle-name", cleanName);
  syncCurrentPlayerToBoard();
  renderPlayerRankings();
  tradeMessageEl.textContent = `Battle-Spieler: ${cleanName} ist online.`;
});

setInterval(() => {
  Object.keys(marketPrices).forEach((symbol) => {
    const drift = (Math.random() - 0.5) * 20;
    marketPrices[symbol] = Math.max(10, marketPrices[symbol] + drift);
    marketHistory[symbol] = [...(marketHistory[symbol] || [marketPrices[symbol]]), marketPrices[symbol]].slice(-16);
  });

  renderTradingState();
}, 2500);

setInterval(() => {
  const now = new Date();
  marketClockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}, 1000);

const savedBattleName = localStorage.getItem("git-chaos-battle-name") || "Ben";
battleNameInput.value = savedBattleName;

populateTradeOptions();
renderTradingState();

// ---------- Geheimnis ----------
const secretBtn = document.getElementById("secret-btn");

secretBtn.addEventListener("click", () => {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");
});

// ---------- Super Ben Bros ----------
const elijahSecretBtn = document.getElementById("elijah-secret");
const superBenModal = document.getElementById("super-ben-modal");
const closeSuperBenBtn = document.getElementById("close-super-ben");
const superBenCanvas = document.getElementById("super-ben-canvas");
const superBenCtx = superBenCanvas.getContext("2d");

const levels = [
  {
    name: "2017",
    sky: "#7dd3fc",
    ground: "#4ade80",
    platformColor: "#a78bfa",
    deco: ["🤡", "🐸", "😹", "🍉"],
    platforms: [
      { x: 0, y: 176, w: 110, h: 24 },
      { x: 148, y: 150, w: 75, h: 18 },
      { x: 255, y: 132, w: 85, h: 18 },
      { x: 370, y: 176, w: 120, h: 24 }
    ],
    enemies: [
      { x: 175, y: 152, w: 18, h: 18, dir: 1 },
      { x: 302, y: 114, w: 18, h: 18, dir: -1 }
    ],
    coins: [
      { x: 62, y: 138 }, { x: 180, y: 112 }, { x: 285, y: 96 }, { x: 410, y: 138 }
    ],
    goal: { x: 470, y: 108, w: 12, h: 68 }
  },
  {
    name: "2018",
    sky: "#bfdbfe",
    ground: "#86efac",
    platformColor: "#f9a8d4",
    deco: ["🥶", "💀", "🫠", "🎧"],
    platforms: [
      { x: 0, y: 176, w: 90, h: 24 },
      { x: 120, y: 156, w: 70, h: 18 },
      { x: 224, y: 130, w: 82, h: 18 },
      { x: 332, y: 146, w: 70, h: 18 },
      { x: 430, y: 176, w: 90, h: 24 }
    ],
    enemies: [
      { x: 160, y: 138, w: 18, h: 18, dir: 1 },
      { x: 365, y: 128, w: 18, h: 18, dir: -1 }
    ],
    coins: [
      { x: 58, y: 142 }, { x: 150, y: 120 }, { x: 250, y: 102 }, { x: 360, y: 118 }, { x: 468, y: 140 }
    ],
    goal: { x: 505, y: 108, w: 12, h: 68 }
  },
  {
    name: "Brainrot",
    sky: "#fcd34d",
    ground: "#34d399",
    platformColor: "#fb7185",
    deco: ["🫵", "💅", "🧠", "🕺"],
    platforms: [
      { x: 0, y: 176, w: 70, h: 24 },
      { x: 98, y: 148, w: 62, h: 18 },
      { x: 190, y: 123, w: 72, h: 18 },
      { x: 295, y: 144, w: 60, h: 18 },
      { x: 390, y: 118, w: 78, h: 18 },
      { x: 490, y: 176, w: 90, h: 24 }
    ],
    enemies: [
      { x: 125, y: 130, w: 18, h: 18, dir: 1 },
      { x: 325, y: 126, w: 18, h: 18, dir: -1 },
      { x: 470, y: 158, w: 18, h: 18, dir: -1 }
    ],
    coins: [
      { x: 44, y: 142 }, { x: 120, y: 110 }, { x: 220, y: 95 }, { x: 318, y: 116 }, { x: 420, y: 90 }, { x: 530, y: 138 }
    ],
    goal: { x: 560, y: 108, w: 12, h: 68 }
  },
  {
    name: "Meme Storm",
    sky: "#ddd6fe",
    ground: "#22c55e",
    platformColor: "#fbbf24",
    deco: ["🧢", "🚀", "📸", "🔥"],
    platforms: [
      { x: 0, y: 176, w: 60, h: 24 },
      { x: 90, y: 154, w: 65, h: 18 },
      { x: 180, y: 129, w: 70, h: 18 },
      { x: 275, y: 108, w: 78, h: 18 },
      { x: 390, y: 138, w: 70, h: 18 },
      { x: 495, y: 176, w: 90, h: 24 }
    ],
    enemies: [
      { x: 118, y: 136, w: 18, h: 18, dir: 1 },
      { x: 310, y: 90, w: 18, h: 18, dir: -1 },
      { x: 440, y: 120, w: 18, h: 18, dir: 1 }
    ],
    coins: [
      { x: 42, y: 142 }, { x: 120, y: 118 }, { x: 212, y: 100 }, { x: 310, y: 80 }, { x: 420, y: 110 }, { x: 530, y: 140 }
    ],
    goal: { x: 570, y: 108, w: 12, h: 68 }
  },
  {
    name: "Final Rizz",
    sky: "#fca5a5",
    ground: "#10b981",
    platformColor: "#fb7185",
    deco: ["😎", "💯", "🦀", "🚩"],
    platforms: [
      { x: 0, y: 176, w: 80, h: 24 },
      { x: 100, y: 152, w: 70, h: 18 },
      { x: 190, y: 128, w: 68, h: 18 },
      { x: 280, y: 110, w: 70, h: 18 },
      { x: 374, y: 133, w: 72, h: 18 },
      { x: 470, y: 158, w: 68, h: 18 },
      { x: 560, y: 176, w: 90, h: 24 }
    ],
    enemies: [
      { x: 130, y: 134, w: 18, h: 18, dir: 1 },
      { x: 215, y: 110, w: 18, h: 18, dir: -1 },
      { x: 318, y: 92, w: 18, h: 18, dir: 1 },
      { x: 520, y: 140, w: 18, h: 18, dir: -1 }
    ],
    coins: [
      { x: 45, y: 142 }, { x: 130, y: 116 }, { x: 208, y: 100 }, { x: 295, y: 82 }, { x: 396, y: 104 }, { x: 488, y: 130 }, { x: 592, y: 142 }
    ],
    goal: { x: 640, y: 108, w: 12, h: 68 }
  }
];

const benGame = {
  running: false,
  levelIndex: 0,
  score: 0,
  message: "",
  cameraX: 0,
  lastTime: 0,
  worldWidth: 660,
  lives: 3,
  keyLeft: false,
  keyRight: false,
  player: {
    x: 42,
    y: 120,
    w: 22,
    h: 28,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
  },
  platforms: [],
  enemies: [],
  coins: [],
  goal: { x: 0, y: 0, w: 12, h: 68 },
  levelCoinsCollected: 0,
};

function setupLevel(index) {
  const level = levels[index];
  benGame.levelIndex = index;
  benGame.message = `${level.name} • ${index + 1}/5`;
  benGame.worldWidth = 660;
  benGame.player.x = 42;
  benGame.player.y = 120;
  benGame.player.vx = 0;
  benGame.player.vy = 0;
  benGame.player.onGround = false;
  benGame.platforms = level.platforms.map((p) => ({ ...p }));
  benGame.enemies = level.enemies.map((e) => ({ ...e }));
  benGame.coins = level.coins.map((c) => ({ ...c, collected: false }));
  benGame.goal = { ...level.goal };
  benGame.levelCoinsCollected = 0;
  benGame.cameraX = 0;
}

function startBenGame() {
  superBenModal.classList.remove("hidden");
  superBenModal.setAttribute("aria-hidden", "false");
  benGame.lives = 3;
  benGame.score = 0;
  benGame.levelIndex = 0;
  benGame.running = true;
  setupLevel(0);
  drawBenGame();
  requestAnimationFrame(gameLoop);
}

function closeBenGame() {
  benGame.running = false;
  superBenModal.classList.add("hidden");
  superBenModal.setAttribute("aria-hidden", "true");
}

function jumpBen() {
  if (!benGame.running) return;
  if (benGame.player.onGround) {
    benGame.player.vy = -7.8;
    benGame.player.onGround = false;
  }
}

function hitPlayer() {
  benGame.lives -= 1;
  if (benGame.lives <= 0) {
    benGame.running = false;
    benGame.message = "You got meme-clowned";
    drawBenGame();
    return;
  }

  benGame.player.x = 42;
  benGame.player.y = 120;
  benGame.player.vx = 0;
  benGame.player.vy = 0;
  benGame.cameraX = 0;
}

function collectCoins() {
  benGame.coins.forEach((coin) => {
    if (coin.collected) return;
    const px = benGame.player.x + benGame.player.w / 2;
    const py = benGame.player.y + benGame.player.h / 2;
    const touching = Math.abs(px - coin.x) < 12 && Math.abs(py - coin.y) < 12;
    if (touching) {
      coin.collected = true;
      benGame.score += 25;
      benGame.levelCoinsCollected += 1;
    }
  });
}

function checkGoal() {
  const player = benGame.player;
  const goal = benGame.goal;
  const overlaps = player.x + player.w > goal.x && player.x < goal.x + goal.w && player.y + player.h > goal.y && player.y < goal.y + goal.h;

  if (!overlaps) return;

  if (benGame.levelIndex < levels.length - 1) {
    benGame.score += 100;
    benGame.levelIndex += 1;
    setupLevel(benGame.levelIndex);
    benGame.message = `Level ${benGame.levelIndex + 1}: ${levels[benGame.levelIndex].name}`;
  } else {
    benGame.running = false;
    benGame.message = "You beat the meme multiverse!";
  }
}

function updateBenGame(delta) {
  const player = benGame.player;
  const level = levels[benGame.levelIndex];

  if (benGame.keyLeft) {
    player.vx = -3;
    player.facing = -1;
  } else if (benGame.keyRight) {
    player.vx = 3;
    player.facing = 1;
  } else {
    player.vx *= 0.7;
    if (Math.abs(player.vx) < 0.1) player.vx = 0;
  }

  player.vy += 0.42 * delta;
  player.x += player.vx * delta;
  player.y += player.vy * delta;

  player.onGround = false;
  for (const p of benGame.platforms) {
    const insideX = player.x + player.w > p.x && player.x < p.x + p.w;
    const landing = player.vy >= 0 && player.y + player.h <= p.y + 14 && player.y + player.h + player.vy * delta >= p.y;
    if (insideX && landing) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }

  if (player.y + player.h >= 200) {
    player.y = 200 - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > benGame.worldWidth) player.x = benGame.worldWidth - player.w;

  for (const enemy of benGame.enemies) {
    enemy.x += enemy.dir * 1.2 * delta;
    if (enemy.x < 30 || enemy.x + enemy.w > benGame.worldWidth - 12) {
      enemy.dir *= -1;
    }

    const hitEnemy = player.x + player.w > enemy.x && player.x < enemy.x + enemy.w && player.y + player.h > enemy.y && player.y < enemy.y + enemy.h;
    if (hitEnemy) {
      const stomp = player.vy > 1 && player.y + player.h - enemy.y < 10;
      if (stomp) {
        enemy.x = -999;
        player.vy = -5;
        benGame.score += 40;
      } else {
        hitPlayer();
      }
    }
  }

  benGame.enemies = benGame.enemies.filter((enemy) => enemy.x > -1000);

  collectCoins();
  checkGoal();

  benGame.cameraX = Math.max(0, Math.min(player.x - 120, benGame.worldWidth - 420));
}

function drawSpriteBen(x, y, w, h, facing, accent) {
  superBenCtx.save();
  superBenCtx.translate(x, y);
  if (facing < 0) superBenCtx.scale(-1, 1);

  superBenCtx.fillStyle = "#fbbf24";
  superBenCtx.fillRect(0, 0, w, h);
  superBenCtx.fillStyle = "#111827";
  superBenCtx.fillRect(5, 6, 4, 4);
  superBenCtx.fillRect(w - 9, 6, 4, 4);
  superBenCtx.fillStyle = accent;
  superBenCtx.fillRect(5, 14, w - 10, 5);
  superBenCtx.restore();
}

function drawBenGame() {
  const level = levels[benGame.levelIndex];
  superBenCtx.clearRect(0, 0, superBenCanvas.width, superBenCanvas.height);

  superBenCtx.fillStyle = level.sky;
  superBenCtx.fillRect(0, 0, superBenCanvas.width, superBenCanvas.height);

  superBenCtx.fillStyle = "rgba(255,255,255,0.15)";
  for (let i = 0; i < 8; i += 1) {
    const cloudX = (i * 70 - benGame.cameraX * 0.25) % (superBenCanvas.width + 80);
    superBenCtx.fillRect(cloudX, 18 + (i % 3) * 18, 28, 12);
    superBenCtx.fillRect(cloudX + 12, 12 + (i % 3) * 18, 18, 10);
  }

  superBenCtx.fillStyle = level.ground;
  superBenCtx.fillRect(0, 176, superBenCanvas.width, 24);

  const visibleX = benGame.cameraX;
  const worldOffset = -visibleX;

  benGame.platforms.forEach((platform) => {
    superBenCtx.fillStyle = level.platformColor;
    superBenCtx.fillRect(platform.x + worldOffset, platform.y, platform.w, platform.h);
  });

  benGame.coins.forEach((coin) => {
    if (coin.collected) return;
    superBenCtx.fillStyle = "#facc15";
    superBenCtx.beginPath();
    superBenCtx.arc(coin.x + worldOffset, coin.y, 7, 0, Math.PI * 2);
    superBenCtx.fill();
    superBenCtx.fillStyle = "#fef3c7";
    superBenCtx.fillText("$", coin.x + worldOffset - 4, coin.y + 4);
  });

  benGame.enemies.forEach((enemy) => {
    superBenCtx.fillStyle = "#7c2d12";
    superBenCtx.fillRect(enemy.x + worldOffset, enemy.y, enemy.w, enemy.h);
    superBenCtx.fillStyle = "#fff";
    superBenCtx.fillRect(enemy.x + worldOffset + 4, enemy.y + 5, 3, 3);
    superBenCtx.fillRect(enemy.x + worldOffset + 11, enemy.y + 5, 3, 3);
  });

  const gate = benGame.goal;
  superBenCtx.fillStyle = "#e2e8f0";
  superBenCtx.fillRect(gate.x + worldOffset, gate.y, gate.w, gate.h);
  superBenCtx.fillStyle = "#f59e0b";
  superBenCtx.fillRect(gate.x + worldOffset + 12, gate.y, 18, 16);

  drawSpriteBen(benGame.player.x + worldOffset, benGame.player.y, benGame.player.w, benGame.player.h, benGame.player.facing, "#f97316");

  const palette = ["🤡", "🐸", "🫠", "🧠", "💀", "🎧", "🚀", "🔥"];
  level.deco.forEach((icon, index) => {
    superBenCtx.fillText(icon, 20 + index * 44, 34);
  });

  superBenCtx.fillStyle = "#111827";
  superBenCtx.font = "bold 16px sans-serif";
  superBenCtx.fillText(`Level ${benGame.levelIndex + 1}: ${level.name}`, 12, 20);
  superBenCtx.fillText(`Lives: ${benGame.lives}`, 320, 20);
  superBenCtx.fillText(`Score: ${benGame.score}`, 12, 44);
  superBenCtx.fillText(benGame.message, 12, 64);

  if (!benGame.running) {
    superBenCtx.fillStyle = "rgba(15, 23, 42, 0.75)";
    superBenCtx.fillRect(80, 70, 260, 60);
    superBenCtx.fillStyle = "#fff";
    superBenCtx.font = "bold 22px sans-serif";
    superBenCtx.fillText(benGame.message || "Game Over", 112, 104);
    superBenCtx.font = "15px sans-serif";
    superBenCtx.fillText("Click or hit space to restart", 115, 126);
  }
}

function gameLoop(timestamp) {
  if (!benGame.running) {
    drawBenGame();
    return;
  }

  if (!benGame.lastTime) {
    benGame.lastTime = timestamp;
  }

  const delta = Math.min((timestamp - benGame.lastTime) / 16.7, 2.4);
  benGame.lastTime = timestamp;

  updateBenGame(delta);
  drawBenGame();

  requestAnimationFrame(gameLoop);
}

elijahSecretBtn.addEventListener("click", () => {
  startBenGame();
});

closeSuperBenBtn.addEventListener("click", () => {
  closeBenGame();
});

superBenModal.addEventListener("click", (event) => {
  if (event.target === superBenModal) {
    closeBenGame();
  }
});

superBenCanvas.addEventListener("click", () => {
  if (!benGame.running) {
    startBenGame();
  } else {
    jumpBen();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") benGame.keyLeft = true;
  if (event.code === "ArrowRight") benGame.keyRight = true;
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    if (superBenModal.classList.contains("hidden")) {
      startBenGame();
    } else if (benGame.running) {
      jumpBen();
    } else {
      startBenGame();
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") benGame.keyLeft = false;
  if (event.code === "ArrowRight") benGame.keyRight = false;
});

// ---------- Trans Toggle ----------
const toggleCheckbox = document.querySelector('.toggle input[type="checkbox"]');
const transElements = document.querySelectorAll('.trans');
const transColors = ["#55CDFC", "#F7A8B8", "#FFFFFF", "#F7A8B8"];
let currentIndex = 0;
let colorInterval = null;

function startColorLoop() {
  if (colorInterval) return;

  colorInterval = setInterval(() => {
    const currentColor = transColors[currentIndex];

    transElements.forEach((element) => {
      element.style.color = currentColor;
    });

    currentIndex = (currentIndex + 1) % transColors.length;
  }, 200);
}

function stopColorLoop() {
  clearInterval(colorInterval);
  colorInterval = null;

  transElements.forEach((element) => {
    element.style.color = "";
  });
}

if (toggleCheckbox) {
  toggleCheckbox.addEventListener("change", function () {
    if (this.checked) {
      transElements.forEach((element) => {
        element.style.backgroundImage = 'url("trans.jpg")';
      });
      startColorLoop();
    } else {
      transElements.forEach((element) => {
        element.style.backgroundImage = "none";
      });
      stopColorLoop();
    }
  });

  if (toggleCheckbox.checked) {
    transElements.forEach((element) => {
      element.style.backgroundImage = 'url("trans.jpg")';
    });
    startColorLoop();
  }
}
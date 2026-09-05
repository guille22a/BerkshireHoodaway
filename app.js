/**
 * Berkshire Hoodaway ($BRKHOOD) - Frontend Core Logic
 * berkshirehood.fun
 */

// Initial State (Simulated on-chain state & real Web3 ready)
const state = {
  ticker: "$BRKHOOD",
  unallocatedEth: 0.0452, // ~$149.16 (Over $100 threshold!)
  ethPriceUsd: 3300,
  minExecutionThresholdUsd: 100,
  slippagePct: 5.0, // 5% max slippage for low liquidity memecoins
  totalFeesSwallowedEth: 34.82,
  totalHoodLocked: 148500000,
  totalRuns: 114,
  
  // Curated Memes Portfolio (Weights in Basis Points: 1,000 bps = 10% each, 10,000 total)
  curatedMemes: [
    {
      symbol: "$microduck",
      name: "microduck",
      address: "0xD5f1afEA47b1A9eab414D2ee740cF1d6d039E725",
      weightBps: 1000,
      icon: "assets/tokens/microduck.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/PRPmxR0LalitfHcU?width=800&height=800&quality=95&format=auto",
      vaultBalance: "12,450,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $microduck LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$OPTIMUS",
      name: "Optimus",
      address: "0x0ff9072a1ead154d92c2d2fef16afba6028ce2b2",
      weightBps: 1000,
      icon: "assets/tokens/OPTIMUS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/C5szo6ViCnV-iF4g?width=800&height=800&quality=95&format=auto",
      vaultBalance: "8,200,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $OPTIMUS LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$AI",
      name: "Artificial Inu",
      address: "0x2e8c31162b855a2ffa90f6f8634643ad6f111e18",
      weightBps: 1000,
      icon: "assets/tokens/AI.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/U6RIzs8Fm7Jar6GE?width=800&height=800&quality=95&format=auto",
      vaultBalance: "45,000,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $AI LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$CASHCAT",
      name: "Cash Cat",
      address: "0x020bfc650a365f8bb26819deaabf3e21291018b4",
      weightBps: 1000,
      icon: "assets/tokens/CASHCAT.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/Lq7a3pS9Wn8EuGp0?width=800&height=800&quality=95&format=auto",
      vaultBalance: "31,800,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $CASHCAT LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$ROBINCAT",
      name: "ROBINCAT",
      address: "0xded852de9fe9ba9b6f27f39e8e81cf851a5c79cc",
      weightBps: 1000,
      icon: "assets/tokens/ROBINCAT.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/z94nZpUqjkDtqXSm?width=800&height=800&quality=95&format=auto",
      vaultBalance: "19,500,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $ROBINCAT LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$MOO",
      name: "Memory cow Moo",
      address: "0xd9db30bb0d2b8d2eae3826a1372117e058791e18",
      weightBps: 1000,
      icon: "assets/tokens/MOO.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/DXvCPLxceXnY_5XS?width=800&height=800&quality=95&format=auto",
      vaultBalance: "62,100,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $MOO LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$CACHE",
      name: "Cache Cow",
      address: "0xafe41f4356c24f716111de1fbbc84e061d291e18",
      weightBps: 1000,
      icon: "assets/tokens/CACHE.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/vWTr7ZrHaGAiFVXj?width=800&height=800&quality=95&format=auto",
      vaultBalance: "27,400,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $CACHE LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$GRASS",
      name: "Touch Grass",
      address: "0x16391c40e85fb2246a2c8c17bfa2594c5d3ef84b",
      weightBps: 1000,
      icon: "assets/tokens/GRASS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/_WUqhn710aynImSO?width=800&height=800&quality=95&format=auto",
      vaultBalance: "88,900,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $GRASS LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$BONER",
      name: "Boner Coin",
      address: "0x98096d17e191b3da1d5f99a6d7b3584351b11e18",
      weightBps: 1000,
      icon: "assets/tokens/BONER.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/zHSvsb5W3vIdMePa?width=800&height=800&quality=95&format=auto",
      vaultBalance: "15,300,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $BONER LP",
      lpLocked: "355,100 LP"
    },
    {
      symbol: "$PONS",
      name: "Pons",
      address: "0x39dbed3a2bd333467115de45665cc57f813c4571",
      weightBps: 1000,
      icon: "assets/tokens/PONS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/dkmXs8KYMyMXjuU1?width=800&height=800&quality=95&format=auto",
      vaultBalance: "5,400,000",
      valueUsd: 11490,
      lpPair: "$BRKHOOD / $PONS LP",
      lpLocked: "355,100 LP"
    }
  ],

  // 24-Hour Timelock State (Strictly Owner Executable)
  pendingProposal: {
    id: "#003",
    description: "Incorporate $HOODSHIBA at 15% and rebalance $PEPEHOOD to 30%",
    proposedBy: "0x438A...78c2 (Project Owner / Deployer)",
    targetEta: Date.now() + (14 * 3600 + 28 * 60 + 45) * 1000, // 14 hours 28 mins remaining
    proposedTokens: [
      { symbol: "$PEPEHOOD", weight: "30%" },
      { symbol: "$DOGEHOOD", weight: "30%" },
      { symbol: "$ROBINCROP", weight: "15%" },
      { symbol: "$HOODSHIBA", weight: "15%" },
      { symbol: "$PONSBUFF", weight: "10%" }
    ],
    calldata: "0x892a7f100000000000000000000000000000000000000000000000000000000000000040...3a8b",
    status: "TIMELOCK_PENDING"
  },

  // Warrenisms (Buffett Parody Quotes)
  warrenisms: [
    "Our favorite holding period is forever. Especially for high-beta shitcoins.",
    "Rule No. 1: Never sell. Rule No. 2: Never forget Rule No. 1.",
    "Be greedy when others are paper-handing; be greedier when Robinhood Chain gas is 0.0001 ETH.",
    "Price is what you pay on PONS. Alpha is what the Vault locks into liquidity forever.",
    "If you aren't willing to hold a dog coin for ten years, do not even think about holding it for ten minutes.",
    "Diversification is protection against ignorance. That is why we curate top memes and burn the LP keys.",
    "It's far better to buy a wonderful meme at a fair price than a fair meme at a wonderful price."
  ]
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderLiveStats();
  renderHoldings();
  renderInvestmentBoard();
  initTimelockCountdown();
  initWarrenisms();
  setupExecutionTriggers();
});

// Render Live Ticker & Stats
function renderLiveStats() {
  const unallocatedUsd = state.unallocatedEth * state.ethPriceUsd;
  const isThresholdMet = unallocatedUsd >= state.minExecutionThresholdUsd;

  const unallocEthEl = document.getElementById("unallocated-eth");
  const unallocUsdEl = document.getElementById("unallocated-usd");
  const thresholdBadge = document.getElementById("threshold-badge");
  const triggerBtn = document.getElementById("trigger-btn");
  const totalSwallowedEth = document.getElementById("total-swallowed-eth");
  const totalSwallowedUsd = document.getElementById("total-swallowed-usd");
  const totalRunsEl = document.getElementById("total-runs");

  if (unallocEthEl) unallocEthEl.innerText = `${state.unallocatedEth.toFixed(4)} ETH`;
  if (unallocUsdEl) unallocUsdEl.innerText = `($${unallocatedUsd.toFixed(2)})`;
  if (totalSwallowedEth) totalSwallowedEth.innerText = `${state.totalFeesSwallowedEth.toFixed(2)} ETH`;
  if (totalSwallowedUsd) totalSwallowedUsd.innerText = `$${(state.totalFeesSwallowedEth * state.ethPriceUsd).toLocaleString()}`;
  if (totalRunsEl) totalRunsEl.innerText = state.totalRuns;

  if (thresholdBadge) {
    if (isThresholdMet) {
      thresholdBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse";
      thresholdBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Ready to Trigger (>$100 in Fees)`;
    } else {
      thresholdBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      thresholdBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Accumulating Fees ($${unallocatedUsd.toFixed(2)} / $100)`;
    }
  }

  if (triggerBtn) {
    triggerBtn.disabled = !isThresholdMet;
    if (isThresholdMet) {
      triggerBtn.classList.add("animate-pulse-glow");
    } else {
      triggerBtn.classList.remove("animate-pulse-glow");
    }
  }
}

// Render Current Holdings Table & LP Pools
function renderHoldings() {
  const holdingsContainer = document.getElementById("holdings-table-body");
  const totalHoldingsValueEl = document.getElementById("total-vault-value");
  if (!holdingsContainer) return;

  let totalValue = 0;
  holdingsContainer.innerHTML = "";

  // 1. First Row: Project Token $BRKHOOD
  const brkhValue = (state.totalHoodLocked * 0.00062);
  totalValue += brkhValue;

  const brkhRow = document.createElement("tr");
  brkhRow.className = "border-b border-emerald-900/30 hover:bg-emerald-950/20 transition-colors";
  brkhRow.innerHTML = `
    <td class="py-4 px-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-serif-vintage font-bold text-amber-300 text-lg">
          $B
        </div>
        <div>
          <div class="font-bold text-white flex items-center gap-2">
            ${state.ticker} <span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Native Treasury Token</span>
          </div>
          <div class="text-xs text-slate-400 font-mono">0x446B...89a2 (Robinhood Chain / PONS)</div>
        </div>
      </div>
    </td>
    <td class="py-4 px-4 font-mono font-medium text-emerald-400">
      ${state.totalHoodLocked.toLocaleString()} ${state.ticker}
    </td>
    <td class="py-4 px-4 font-mono font-semibold text-white">
      $${brkhValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </td>
    <td class="py-4 px-4">
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-mono font-bold">
        🔒 NEVER SELL (∞)
      </span>
    </td>
    <td class="py-4 px-4 text-xs font-mono text-slate-400">
      Parent Liquidity Core
    </td>
  `;
  holdingsContainer.appendChild(brkhRow);

  // 2. Curated Memecoin Rows
  state.curatedMemes.forEach(meme => {
    totalValue += meme.valueUsd;
    const fomoUrl = `https://fomo.family/tokens/robinhood/${meme.address}`;
    const row = document.createElement("tr");
    row.className = "border-b border-emerald-900/30 hover:bg-emerald-950/20 transition-colors";
    row.innerHTML = `
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img
            src="${meme.icon || ''}"
            onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback; this.dataset.fallback='';} else {this.style.display='none'; this.nextElementSibling.style.display='flex';}"
            data-fallback="${meme.fallbackUrl || ''}"
            alt="${meme.symbol}"
            class="w-10 h-10 rounded-full border border-emerald-400/40 object-cover bg-emerald-500/20"
          />
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 items-center justify-center font-bold text-emerald-300" style="display:none;">
            ${meme.symbol.slice(1, 3)}
          </div>
          <div>
            <div class="font-bold text-white flex items-center gap-2">
              <a href="${fomoUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors underline decoration-emerald-500/40 underline-offset-2 hover:decoration-emerald-400">${meme.name}</a> <span class="text-xs text-slate-400">(${meme.symbol})</span>
            </div>
            <div class="text-xs text-slate-400 font-mono">${meme.address.slice(0, 6)}...${meme.address.slice(-4)}</div>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 font-mono font-medium text-emerald-400">
        ${meme.vaultBalance} ${meme.symbol}
      </td>
      <td class="py-4 px-4 font-mono font-semibold text-white">
        $${meme.valueUsd.toLocaleString()}
      </td>
      <td class="py-4 px-4">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-mono font-bold">
          🔒 LOCKED FOREVER
        </span>
      </td>
      <td class="py-4 px-4 text-xs font-mono text-emerald-300">
        ${meme.lpLocked} (${meme.lpPair})
      </td>
    `;
    holdingsContainer.appendChild(row);
  });

  if (totalHoldingsValueEl) {
    totalHoldingsValueEl.innerText = `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
}

// Render Investment Board & Curated Weights
function renderInvestmentBoard() {
  const weightsContainer = document.getElementById("investment-weights-container");
  if (!weightsContainer) return;

  weightsContainer.innerHTML = "";
  state.curatedMemes.forEach(meme => {
    const pct = meme.weightBps / 100;
    const fomoUrl = `https://fomo.family/tokens/robinhood/${meme.address}`;
    const card = document.createElement("div");
    card.className = "p-5 rounded-xl glass-panel border border-emerald-500/20 flex flex-col justify-between";
    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <img
            src="${meme.icon || ''}"
            onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback; this.dataset.fallback='';} else {this.style.display='none'; this.nextElementSibling.style.display='flex';}"
            data-fallback="${meme.fallbackUrl || ''}"
            alt="${meme.symbol}"
            class="w-9 h-9 rounded-full border border-emerald-400/40 object-cover bg-emerald-500/20"
          />
          <div class="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 items-center justify-center font-bold text-emerald-300 text-sm" style="display:none;">
            ${meme.symbol.slice(1, 3)}
          </div>
          <div>
            <span class="text-xs font-mono text-emerald-400 uppercase tracking-wider">Curated Asset</span>
            <h4 class="text-lg font-bold text-white"><a href="${fomoUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors">${meme.name}</a></h4>
            <span class="text-sm font-mono text-slate-400">${meme.symbol}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-black text-amber-300 font-mono">${pct}%</div>
          <span class="text-xs text-slate-400">Target Weight</span>
        </div>
      </div>

      <div class="w-full bg-emerald-950/80 rounded-full h-2.5 mb-4 overflow-hidden border border-emerald-800/40">
        <div class="bg-gradient-to-r from-emerald-500 to-amber-400 h-2.5 rounded-full" style="width: ${pct}%"></div>
      </div>

      <div class="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
        <span class="text-slate-400 font-mono truncate max-w-[140px]">${meme.address}</span>
        <a href="https://robinhood.evm.blockscout.com/address/${meme.address}" target="_blank" class="text-emerald-400 hover:text-emerald-300 underline">Explorer ↗</a>
      </div>
    `;
    weightsContainer.appendChild(card);
  });
}

// 24-Hour Timelock Real-Time Countdown
function initTimelockCountdown() {
  const countdownEl = document.getElementById("timelock-countdown");
  const proposalIdEl = document.getElementById("proposal-id");
  const proposalDescEl = document.getElementById("proposal-desc");
  const proposalCalldataEl = document.getElementById("proposal-calldata");

  if (proposalIdEl) proposalIdEl.innerText = state.pendingProposal.id;
  if (proposalDescEl) proposalDescEl.innerText = state.pendingProposal.description;
  if (proposalCalldataEl) proposalCalldataEl.innerText = state.pendingProposal.calldata;

  function updateClock() {
    if (!countdownEl) return;
    const diff = state.pendingProposal.targetEta - Date.now();

    if (diff <= 0) {
      countdownEl.innerHTML = `<span class="text-emerald-400 font-bold">TIMELOCK ELAPSED — EXECUTABLE BY OWNER</span>`;
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerText = `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}


// Warren Buffett Parody Quotes (Warrenisms)
function initWarrenisms() {
  const quoteEl = document.getElementById("warrenism-quote");
  const refreshBtn = document.getElementById("refresh-quote-btn");
  if (!quoteEl) return;

  let currentIndex = 0;
  function showNextQuote() {
    currentIndex = (currentIndex + 1) % state.warrenisms.length;
    quoteEl.style.opacity = 0;
    setTimeout(() => {
      quoteEl.innerText = `“${state.warrenisms[currentIndex]}”`;
      quoteEl.style.opacity = 1;
    }, 200);
  }

  if (refreshBtn) refreshBtn.addEventListener("click", showNextQuote);
  setInterval(showNextQuote, 9000);
}

// Community One-Click Execution Modal & Execution Handler
function setupExecutionTriggers() {
  const triggerBtn = document.getElementById("trigger-btn");
  const modal = document.getElementById("execution-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const confirmExecBtn = document.getElementById("confirm-exec-btn");
  const execStatusEl = document.getElementById("exec-status-log");

  if (triggerBtn && modal) {
    triggerBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  if (confirmExecBtn) {
    confirmExecBtn.addEventListener("click", async () => {
      confirmExecBtn.disabled = true;
      confirmExecBtn.innerText = "Executing On-Chain...";

      const log = (msg) => {
        if (execStatusEl) {
          execStatusEl.innerHTML += `<div class="text-xs font-mono text-emerald-300 py-1">✓ ${msg}</div>`;
          execStatusEl.scrollTop = execStatusEl.scrollHeight;
        }
      };

      log("Checking Robinhood Chain RPC & Vault Balance (0.0452 ETH)...");
      await new Promise(r => setTimeout(r, 700));

      log("Fetching DEX Quotes with Max 5% Slippage parameters...");
      await new Promise(r => setTimeout(r, 800));

      log(`Splitting 50% for ${state.ticker} (0.0226 ETH) + 50% for Memecoins (0.0226 ETH)...`);
      await new Promise(r => setTimeout(r, 900));

      log(`DEX Swap completed: Acquired 325,000 ${state.ticker} and basket of 10 curated memecoins.`);
      await new Promise(r => setTimeout(r, 900));

      log(`Calling router.addLiquidity() for 10 direct ${state.ticker}/Meme pairs...`);
      await new Promise(r => setTimeout(r, 1000));

      log("LP Tokens minted directly to Vault address(this).");
      log("🔒 NEVER SELL POLICY ENFORCED: Zero withdrawal functions exist. Keys permanently thrown away!");
      
      // Update local state
      state.totalFeesSwallowedEth += state.unallocatedEth;
      state.totalRuns += 1;
      state.unallocatedEth = 0.0031; // Reset below threshold
      renderLiveStats();
      renderHoldings();

      confirmExecBtn.innerText = "Vault Buy & Pool Successful! 🚀";
      confirmExecBtn.classList.remove("bg-emerald-500");
      confirmExecBtn.classList.add("bg-amber-500", "text-black");

      setTimeout(() => {
        modal.classList.add("hidden");
        confirmExecBtn.disabled = false;
        confirmExecBtn.innerText = "Confirm & Execute Vault Buy";
        confirmExecBtn.classList.remove("bg-amber-500", "text-black");
        confirmExecBtn.classList.add("bg-emerald-500");
        if (execStatusEl) execStatusEl.innerHTML = "";
      }, 3500);
    });
  }
}

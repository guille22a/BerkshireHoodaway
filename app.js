/**
 * Berkshire Hoodaway ($BRKHOOD) - Frontend Core Logic
 * berkshirehood.fun
 */

// Initial State (Day-0 Real Launch State)
const state = {
  ticker: "$BRKHOOD",
  tokenAddress: "0xB1feD23B5527CD085f8C965737cFB13FF43Bc5E7",
  vaultAddress: "0x91105C8ED3bF8A2E21d1514314f62fa5ea614352",
  quoteTokenAddress: "0xec262a75e413fafd0df80480274532c79d42da09", // $MSTR
  ponsLaunchpadUrl: "https://www.ponsfamily.com/launchpad/0xB1feD23B5527CD085f8C965737cFB13FF43Bc5E7",
  unallocatedMstr: 0.0, // Live MSTR fees accumulated in Vault
  mstrPriceUsd: 135.0, // $MSTR Stock Token price USD
  minExecutionBalanceMstr: 0.1, // 0.1 MSTR minimum trigger threshold
  slippagePct: 5.0, // 5% max slippage for low liquidity memecoins
  totalFeesSwallowedMstr: 0.0,
  totalHoodLocked: 0,
  totalRuns: 0,
  
  // Curated Memes Portfolio (Weights in Basis Points: 1,000 bps = 10% each, 10,000 total)
  curatedMemes: [
    {
      symbol: "$microduck",
      name: "microduck",
      address: "0xD5f1afEA47b1A9eab414D2ee740cF1d6d039E725",
      weightBps: 1000,
      icon: "assets/tokens/microduck.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/PRPmxR0LalitfHcU?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $microduck LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$OPTIMUS",
      name: "Optimus",
      address: "0x0ff9072a1ead154d92c2d2fef16afba6028ce2b2",
      weightBps: 1000,
      icon: "assets/tokens/OPTIMUS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/C5szo6ViCnV-iF4g?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $OPTIMUS LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$AI",
      name: "Artificial Inu",
      address: "0x2e8c31162b855a2ffa90f6f8634643ad6f111e18",
      weightBps: 1000,
      icon: "assets/tokens/AI.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/U6RIzs8Fm7Jar6GE?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $AI LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$CASHCAT",
      name: "Cash Cat",
      address: "0x020bfc650a365f8bb26819deaabf3e21291018b4",
      weightBps: 1000,
      icon: "assets/tokens/CASHCAT.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/Lq7a3pS9Wn8EuGp0?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $CASHCAT LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$ROBINCAT",
      name: "ROBINCAT",
      address: "0xded852de9fe9ba9b6f27f39e8e81cf851a5c79cc",
      weightBps: 1000,
      icon: "assets/tokens/ROBINCAT.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/z94nZpUqjkDtqXSm?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $ROBINCAT LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$MOO",
      name: "Memory cow Moo",
      address: "0xd9db30bb0d2b8d2eae3826a1372117e058791e18",
      weightBps: 1000,
      icon: "assets/tokens/MOO.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/DXvCPLxceXnY_5XS?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $MOO LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$CACHE",
      name: "Cache Cow",
      address: "0xafe41f4356c24f716111de1fbbc84e061d291e18",
      weightBps: 1000,
      icon: "assets/tokens/CACHE.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/vWTr7ZrHaGAiFVXj?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $CACHE LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$GRASS",
      name: "Touch Grass",
      address: "0x16391c40e85fb2246a2c8c17bfa2594c5d3ef84b",
      weightBps: 1000,
      icon: "assets/tokens/GRASS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/_WUqhn710aynImSO?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $GRASS LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$BONER",
      name: "Boner Coin",
      address: "0x98096d17e191b3da1d5f99a6d7b3584351b11e18",
      weightBps: 1000,
      icon: "assets/tokens/BONER.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/zHSvsb5W3vIdMePa?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $BONER LP",
      lpLocked: "0 LP"
    },
    {
      symbol: "$PONS",
      name: "Pons",
      address: "0x39dbed3a2bd333467115de45665cc57f813c4571",
      weightBps: 1000,
      icon: "assets/tokens/PONS.png",
      fallbackUrl: "https://cdn.dexscreener.com/cms/images/dkmXs8KYMyMXjuU1?width=800&height=800&quality=95&format=auto",
      vaultBalance: "0",
      valueUsd: 0,
      lpPair: "$BRKHOOD / $PONS LP",
      lpLocked: "0 LP"
    }
  ],

  // 24-Hour Timelock State (No active proposals currently)
  pendingProposal: null,

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
  fetchLiveVaultState();
  setInterval(fetchLiveVaultState, 10000); // Live poll on-chain every 10s
});

// Render Live Ticker & Stats
function renderLiveStats() {
  const unallocatedUsd = state.unallocatedMstr * state.mstrPriceUsd;
  const isThresholdMet = state.unallocatedMstr >= state.minExecutionBalanceMstr;

  const unallocMstrEl = document.getElementById("unallocated-mstr");
  const unallocUsdEl = document.getElementById("unallocated-usd");
  const thresholdBadge = document.getElementById("threshold-badge");
  const triggerBtn = document.getElementById("trigger-btn");
  const totalSwallowedMstr = document.getElementById("total-swallowed-mstr");
  const totalSwallowedUsd = document.getElementById("total-swallowed-usd");
  const totalRunsEl = document.getElementById("total-runs");

  if (unallocMstrEl) unallocMstrEl.innerText = `${state.unallocatedMstr.toFixed(4)} MSTR`;
  if (unallocUsdEl) unallocUsdEl.innerText = `($${unallocatedUsd.toFixed(2)})`;
  if (totalSwallowedMstr) totalSwallowedMstr.innerText = `${state.totalFeesSwallowedMstr.toFixed(2)} MSTR`;
  if (totalSwallowedUsd) totalSwallowedUsd.innerText = `$${(state.totalFeesSwallowedMstr * state.mstrPriceUsd).toLocaleString()}`;
  if (totalRunsEl) totalRunsEl.innerText = state.totalRuns;

  if (thresholdBadge) {
    if (isThresholdMet) {
      thresholdBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse";
      thresholdBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Ready to Trigger (≥ 0.1 MSTR in Fees)`;
    } else {
      thresholdBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
      thresholdBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Accumulating Fees (${state.unallocatedMstr.toFixed(4)} / 0.1 MSTR)`;
    }
  }

  // Update modal preview values
  const modalUnalloc = document.getElementById("modal-unalloc-mstr");
  const modalBrkhood = document.getElementById("modal-brkhood-mstr");
  const modalMemes = document.getElementById("modal-memes-mstr");
  if (modalUnalloc) modalUnalloc.innerText = `${state.unallocatedMstr.toFixed(4)} MSTR ($${unallocatedUsd.toFixed(2)})`;
  if (modalBrkhood) modalBrkhood.innerText = `${(state.unallocatedMstr * 0.5).toFixed(4)} MSTR`;
  if (modalMemes) modalMemes.innerText = `${(state.unallocatedMstr * 0.5).toFixed(4)} MSTR (10 Memes)`;

  if (triggerBtn) {
    if (isThresholdMet) {
      triggerBtn.classList.add("animate-pulse-glow");
    } else {
      triggerBtn.classList.remove("animate-pulse-glow");
    }
  }
}

// Fetch Real On-Chain Vault State from Robinhood Chain RPC
async function fetchLiveVaultState() {
  try {
    const rpc = 'https://rpc.mainnet.chain.robinhood.com/';
    const vault = state.vaultAddress.toLowerCase().replace('0x', '');
    const mstr = state.quoteTokenAddress;

    // balanceOf(address) selector: 0x70a08231
    const balData = '0x70a08231000000000000000000000000' + vault;

    const res = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: mstr, data: balData }, 'latest']
      })
    });
    const json = await res.json();
    if (json.result && json.result !== '0x') {
      const balBig = BigInt(json.result);
      state.unallocatedMstr = Number(balBig) / 1e18;
      renderLiveStats();
    }
  } catch (err) {
    console.warn("Live on-chain vault polling notice:", err.message);
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
        <img
          src="assets/warren-hood.jpg"
          alt="${state.ticker}"
          class="w-10 h-10 rounded-full border-2 border-amber-400/80 object-cover bg-amber-500/20 shadow-md shadow-amber-500/20"
        />
        <div>
          <div class="font-bold text-white flex items-center gap-2">
            ${state.ticker} <span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Native Treasury Token</span>
          </div>
          <div class="text-xs text-slate-400 font-mono">
            <a href="https://www.ponsfamily.com/launchpad/0xB1feD23B5527CD085f8C965737cFB13FF43Bc5E7" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 underline decoration-emerald-500/40">0xB1fe...c5E7</a> (Robinhood Chain / PONS)
          </div>
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
        <a href="https://robinhoodchain.blockscout.com/address/${meme.address}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 underline">Explorer ↗</a>
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

  if (!state.pendingProposal) {
    if (countdownEl) countdownEl.innerText = "NO ACTIVE PROPOSALS";
    return;
  }

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

// Web3 Community & Owner Execution Modal Handler
function setupExecutionTriggers() {
  const triggerBtn = document.getElementById("trigger-btn");
  const heroTriggerBtn = document.getElementById("hero-trigger-btn");
  const modal = document.getElementById("execution-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const connectWalletBtn = document.getElementById("connect-wallet-btn");
  const connectWalletText = document.getElementById("connect-wallet-text");
  const execStatusEl = document.getElementById("exec-status-log");

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.remove("hidden");
      // Update dynamic amounts
      const unallocEl = document.getElementById("modal-unalloc-mstr");
      const brkhoodEl = document.getElementById("modal-brkhood-mstr");
      const memesEl = document.getElementById("modal-memes-mstr");
      const bal = state.unallocatedMstr;
      if (unallocEl) unallocEl.innerText = `${bal.toFixed(4)} MSTR (~$${(bal * state.mstrPriceUsd).toFixed(2)})`;
      if (brkhoodEl) brkhoodEl.innerText = `${(bal * 0.5).toFixed(4)} MSTR`;
      if (memesEl) memesEl.innerText = `${(bal * 0.5).toFixed(4)} MSTR (10 Memes)`;
    }
  };

  if (triggerBtn) triggerBtn.addEventListener("click", openModal);
  if (heroTriggerBtn) heroTriggerBtn.addEventListener("click", openModal);

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Real MetaMask / Web3 Wallet Connection
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      if (typeof window.ethereum === "undefined") {
        if (execStatusEl) {
          execStatusEl.innerHTML = `
            <div class="text-amber-400 font-bold">⚠️ No Web3 Wallet Detected</div>
            <div class="text-slate-300 mt-1">Please install MetaMask or open via Robinhood Chain Blockscout Write Contract tab directly.</div>
          `;
        }
        return;
      }

      try {
        connectWalletBtn.disabled = true;
        if (connectWalletText) connectWalletText.innerText = "Connecting Wallet...";

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        const chainId = await window.ethereum.request({ method: "eth_chainId" });

        const ownerAddress = "0x53bf851448571a7a1f190aca5f27a8d33e353df8";
        const isOwner = account.toLowerCase() === ownerAddress.toLowerCase();

        if (connectWalletText) {
          connectWalletText.innerText = `${account.slice(0, 6)}...${account.slice(-4)}`;
        }
        connectWalletBtn.classList.remove("bg-emerald-500", "hover:bg-emerald-400");
        connectWalletBtn.classList.add("bg-omaha-900", "text-emerald-300", "border", "border-emerald-500/50");

        if (execStatusEl) {
          if (isOwner) {
            execStatusEl.innerHTML = `
              <div class="text-gold-400 font-bold flex items-center gap-1.5">👑 Warren / Board Deployer Wallet Recognized</div>
              <div class="text-emerald-300 mt-1">Wallet: <span class="font-mono">${account}</span></div>
              <div class="text-slate-300 mt-1">
                Vault has <strong>${state.unallocatedMstr.toFixed(4)} MSTR</strong> ready. Open the Blockscout explorer below to execute <code class="text-gold-300">executeRouterSwap()</code> or update token via <code class="text-gold-300">setBrkhoodToken()</code>!
              </div>
            `;
          } else {
            execStatusEl.innerHTML = `
              <div class="text-emerald-400 font-bold">✓ Connected: ${account.slice(0, 8)}...${account.slice(-6)}</div>
              <div class="text-slate-300 mt-1">Robinhood Chain ID: <span class="font-mono text-gold-400">${parseInt(chainId, 16) || 4663}</span></div>
              <div class="text-slate-400 mt-1">
                Vault has <strong>${state.unallocatedMstr.toFixed(4)} MSTR</strong> accumulated. Swaps are executed by the Board via router call with 5% slippage protection!
              </div>
            `;
          }
        }
      } catch (err) {
        console.error("MetaMask connection error:", err);
        connectWalletBtn.disabled = false;
        if (connectWalletText) connectWalletText.innerText = "Connect MetaMask";
        if (execStatusEl) {
          execStatusEl.innerHTML = `<div class="text-red-400">Connection rejected: ${err.message || err}</div>`;
        }
      }
    });
  }
}

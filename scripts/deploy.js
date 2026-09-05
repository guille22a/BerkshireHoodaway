/**
 * Deployment script for BerkshireVault on Robinhood Chain
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network robinhood
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log("==================================================");
  console.log("  Deploying Berkshire Hoodaway ($BRKHOOD) Vault   ");
  console.log("==================================================");

  // Load Day 1 Configuration
  const configPath = path.join(__dirname, '../contracts/deployment-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const hoodToken = config.hoodTokenAddress;
  const router = config.routerAddress;
  const initialMemes = config.dayOneInitialPortfolio.tokens.map(t => t.address);
  const initialWeights = config.dayOneInitialPortfolio.tokens.map(t => t.weightBps);

  console.log("1. Checking Day 1 Parameters:");
  console.log("- $BRKHOOD Token:", hoodToken);
  console.log("- DEX Router:", router);
  console.log("- Day 1 Curated Memes Count:", initialMemes.length);
  
  let totalBps = 0;
  config.dayOneInitialPortfolio.tokens.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.symbol} (${t.percentage}): ${t.address}`);
    totalBps += t.weightBps;
  });

  if (totalBps !== 10000) {
    throw new Error(`Weights must sum exactly to 10,000 basis points! Current sum: ${totalBps}`);
  }

  console.log("\n2. Deploying BerkshireVault.sol to Robinhood Chain...");
  console.log("-> Day 1 memes are loaded IMMEDIATELY in the constructor.");
  console.log("-> NO 24-hour timelock is needed for Day 1 — the vault starts working from minute one!");

  /* 
  // Hardhat Ethers deployment pattern:
  const BerkshireVault = await ethers.getContractFactory("BerkshireVault");
  const vault = await BerkshireVault.deploy(
    hoodToken,
    router,
    initialMemes,
    initialWeights
  );
  await vault.deployed();
  console.log("\n✓ BerkshireVault successfully deployed to:", vault.address);
  */

  console.log("\n✓ Ready for deployment when you provide your token addresses!");
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { main };

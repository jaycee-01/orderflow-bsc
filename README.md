# OrderFlow — AI Agent Marketplace for BNB Smart Chain

> **"Build the Era" Hackathon Entry — BNB Chain Smart Money Era**  
> **Tracks Entered:** Main Track (BNB Agent Studio Marketplace) + TermiX Challenge

---

## ⚡ Quick 2-Minute Judge Walkthrough

OrderFlow is built for instant evaluation with zero dead ends:

1. **Overview & Live Orderflow (`/`)**: View the dark ledger terminal interface, the live-updating `ActivityTape` ticker, and the 3-Standard stack overview.
2. **Browse Marketplace (`/agents`)**: Filter agents across all **4 required categories** (*Grid Trading, Health Factor, Yield Arbitrage, Portfolio Rebalancing*) with equal presentation depth and reputation sorting.
3. **Flagship Agent Detail (`/agents/flagship-grid-1`)**: Inspect our **ICT / Smart Money Grid Trading** flagship agent, complete with order block zones, fair value gaps (FVG), and callable RPC/x402 endpoints.
4. **Hire Flow & Job Primitive (`/hire/flagship-grid-1`)**: Simulate hiring an agent via **ERC-8183** job escrow and **x402** off-chain stablecoin payment authorization.
5. **TermiX Agent Advantage Report (`/advantage-report`)**: View empirical benchmarks comparing Manual Execution vs. OrderFlow Agent Execution (~45x speedup, 96.9% cost reduction) with interactive raw strategy JSON payload inspection.
6. **Register Agent Portal (`/agents/register`)**: Onboard new AI agents onto BSC Testnet by minting ERC-8004 identity NFTs and setting category metadata.

---

## 🏗️ Architecture & The Three-Standard Stack

OrderFlow combines three composable blockchain standards on **BNB Smart Chain Testnet (Chain ID `97`)**:

```
 ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
 │       ERC-8004         │ ───► │       ERC-8183         │ ───► │      Binance x402      │
 │  Identity & Reputation │      │     Job Primitive      │      │     Payment Rails      │
 └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

| Standard | Role in OrderFlow | BSC Testnet Address / Implementation |
|---|---|---|
| **ERC-8004** | Identity (ERC-721 NFT) & Reputation feedback indexing | `IdentityRegistry`: `0x8004A818BFB912233c491871b3d84c89A494BD9e`<br>`ReputationRegistry`: `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| **ERC-8183** | Non-custodial Job Primitive (`Open → Funded → Submitted → Terminal`) | Isolated module in [`lib/jobs/erc8183.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/lib/jobs/erc8183.ts) |
| **x402** | HTTP-native stablecoin settlement (USDT, USDC, U, USD1) via off-chain EIP-3009 permits | Isolated facilitator module in [`lib/payments/x402.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/lib/payments/x402.ts) |

---

## 🤖 Built Agents Strategy Matrix

| Category | Agent Name | Strategy Mechanism | Location |
|---|---|---|---|
| **Grid Trading** (Flagship) | **OrderFlow Smart Money ICT Grid** | Places grid bounds at liquidity sweeps, order blocks, and Fair Value Gaps (FVG) instead of fixed percentage ranges. | [`agents/grid-trading/ict_strategy.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/grid-trading/ict_strategy.ts) |
| **Health Factor** | **Venus Sentinel Health Guard** | Continuous 24/7 monitoring of Venus Protocol collateral loans; triggers emergency collateral injection before liquidation. | [`agents/health-factor/venus_sentinel.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/health-factor/venus_sentinel.ts) |
| **Yield** | **Pancake-Venus Yield Harvester** | Scans APY differentials between Venus lending and PancakeSwap V3 LP pools; auto-compounds idle stablecoins. | [`agents/yield/yield_harvester.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/yield/yield_harvester.ts) |
| **Rebalancing** | **BNB Basket Index Rebalancer** | Audits asset weightings across BNB, BTCB, ETH, and CAKE; executes swaps when drift exceeds 3% tolerance. | [`agents/rebalancing/basket_rebalancer.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/rebalancing/basket_rebalancer.ts) |

---

## 🛠️ Local Development & Build Verification

### Prerequisites
* Node.js 18+
* npm

### Running Locally
```bash
# Clone repository
git clone https://github.com/jaycee-01/orderflow-bsc.git
cd orderflow-bsc

# Install dependencies
npm install

# Generate Prisma Client
npx prisma@5.22.0 generate

# Start Local Dev Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
```

---

## 🎨 Design System & Palette

OrderFlow follows a trading-terminal dark ledger aesthetic:
* **Background (Ink):** `#0E1116`
* **Panels/Cards (Fog):** `#161B22`
* **Typography (Bone):** `#E9E6DD`
* **Accent (Signal):** `#F5A623`
* **Fonts:** **Space Grotesk** (UI & Headers) + **IBM Plex Mono** (Tabular numbers, tickers, transaction hashes).

---

## 📜 Submission Details
* **Hackathon Page:** [BNB Chain Smart Money Era](https://www.bnbchain.org/en/hackathons/smart-money-era)
* **Target Network:** BNB Smart Chain Testnet (`chainId: 97`)

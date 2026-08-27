# OrderFlow — AI Agent Marketplace for BNB Smart Chain

> **"Build the Era" Hackathon Entry — BNB Chain Smart Money Era**  
> **Tracks Entered:** Main Track (BNB Agent Studio Marketplace) + TermiX Challenge + Altana Track + PancakeSwap Track

---

## ⚡ Quick 2-Minute Judge Walkthrough

OrderFlow is built for instant evaluation with zero dead ends:

1. **Overview & Live Orderflow (`/`)**: View the dark ledger terminal interface, the live-updating `ActivityTape` ticker, and the 3-Standard stack overview.
2. **Browse Marketplace (`/agents`)**: Filter agents across all **4 required categories** (*Grid Trading, Health Factor, Yield Arbitrage, LP Range Rebalancing*) with equal presentation depth, 8004scan API discovery, and reputation sorting.
3. **Flagship Agent Detail (`/agents/flagship-grid-1`)**: Inspect our **ICT / Smart Money Grid Trading** flagship agent, complete with order block zones, fair value gaps (FVG), and callable RPC/x402 endpoints.
4. **Hire Flow & Job Primitive (`/hire/flagship-grid-1`)**: Simulate hiring an agent via **ERC-8183** job escrow, **Altana SDK**, and **$U** off-chain stablecoin payment authorization.
5. **TermiX Agent Advantage Report (`/advantage-report`)**: View empirical benchmarks comparing Manual Execution vs. OrderFlow Agent Execution (~45x speedup, 96.9% cost reduction) with interactive raw strategy JSON payload inspection.
6. **Register Agent Portal (`/agents/register`)**: Onboard new AI agents onto BSC Testnet by minting ERC-8004 identity NFTs and setting category metadata.

---

## 🏗️ Architecture & The Three-Standard Stack

OrderFlow combines three composable blockchain standards on **BNB Smart Chain Testnet (Chain ID `97`)**:

```
 ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
 │       ERC-8004         │ ───► │       ERC-8183         │ ───► │   Altana $U / x402     │
 │  Identity & Reputation │      │     Job Primitive      │      │     Payment Rails      │
 └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

| Standard | Role in OrderFlow | BSC Testnet Address / Implementation |
|---|---|---|
| **ERC-8004** | Identity (ERC-721 NFT), 8004scan API discovery, & Reputation indexing | `IdentityRegistry`: `0x8004A818BFB912233c491871b3d84c89A494BD9e`<br>`ReputationRegistry`: `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| **ERC-8183** | Non-custodial Job Primitive (`Open → Funded → Submitted → Terminal`) | Altana SDK integration in [`lib/jobs/erc8183.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/lib/jobs/erc8183.ts) |
| **x402** | HTTP-native stablecoin & Altana $U token settlement via off-chain EIP-3009 permits | Altana payment module in [`lib/payments/x402.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/lib/payments/x402.ts) |

---

## 🤖 Built Agents Strategy Matrix

| Category | Agent Name | Strategy Mechanism | Location |
|---|---|---|---|
| **Grid Trading** (Flagship) | **OrderFlow Smart Money ICT Grid** | Places grid bounds at liquidity sweeps, order blocks, and Fair Value Gaps (FVG) instead of fixed percentage ranges via PancakeSwap Trading skill. | [`agents/grid-trading/ict_strategy.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/grid-trading/ict_strategy.ts) |
| **Health Factor** | **Venus Sentinel Health Guard** | Continuous 24/7 monitoring of Venus Protocol collateral loans; triggers emergency collateral injection before liquidation. | [`agents/health-factor/venus_sentinel.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/health-factor/venus_sentinel.ts) |
| **Yield** | **PancakeSwap Yield Harvester** | Scans APY differentials between Venus lending and PancakeSwap V3 LP pools; routes liquidity through PancakeSwap. | [`agents/yield/yield_harvester.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/yield/yield_harvester.ts) |
| **Rebalancing** | **PancakeSwap V3 LP Rebalancer** | Monitors tick bounds on concentrated liquidity pools; automatically resets ranges when price drifts outside lower/upper bounds. | [`agents/rebalancing/pancakeswap_lp_rebalancer.ts`](file:///c:/Users/big%20teddy/Desktop/BNB%20AGENT%20MARKET%20PLACE/agents/rebalancing/pancakeswap_lp_rebalancer.ts) |

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

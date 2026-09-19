# Lumecast Frontend

The web application for **Lumecast**, a prediction market platform built on Stellar/Soroban. Users browse markets, connect a wallet, trade outcome shares, and manage their positions here.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Repo Structure](#repo-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deploying](#deploying)
- [Contributing](#contributing)
- [License](#license)

## Overview

This app is the primary user-facing surface for Lumecast. It reads market/trade data from [`lumecast/indexer-api`](https://github.com/lumecast/indexer-api) and writes to the Stellar ledger via the [`lumecast/contracts`](https://github.com/lumecast/contracts) market contract, using [Freighter](https://www.freighter.app/) for wallet signing.

Key flows:
- Browse and search prediction markets
- View live odds and volume on a market detail page
- Buy/sell outcome shares
- Track your positions and claim winnings after resolution
- (Admin/resolver role) create markets and propose/dispute outcomes

## Architecture

```
┌────────────┐      reads      ┌────────────────┐
│  Frontend  │ ◄────────────── │  indexer-api    │
│  (this)    │                 │ (market/trade   │
│            │                 │  history, odds) │
└─────┬──────┘                 └─────────────────┘
      │ writes (signed txns via Freighter)
      ▼
┌─────────────────┐
│ Soroban RPC /    │
│ market contract  │
│ (lumecast/       │
│  contracts)      │
└─────────────────┘
```

## Repo Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/            # Route-level pages (markets list, detail, portfolio, admin)
│   ├── hooks/             # Data-fetching and wallet hooks
│   ├── lib/
│   │   ├── stellar/       # Soroban/Stellar SDK wrappers, transaction builders
│   │   └── api/            # indexer-api client
│   ├── styles/             # Design tokens, Tailwind config
│   └── App.tsx
├── public/
├── tests/
├── PLAN.md
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Freighter wallet](https://www.freighter.app/) browser extension (for testing trade flows)
- A running or hosted instance of [`lumecast/indexer-api`](https://github.com/lumecast/indexer-api) (local or staging)

## Getting Started

```bash
git clone https://github.com/lumecast/frontend.git
cd frontend
npm install

cp .env.example .env
# edit .env — see Environment Variables below

npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_INDEXER_API_URL` | Base URL for `lumecast/indexer-api` |
| `VITE_SOROBAN_RPC_URL` | Soroban RPC endpoint (testnet or mainnet) |
| `VITE_MARKET_CONTRACT_ID` | Deployed address of the market contract |
| `VITE_USDC_CONTRACT_ID` | USDC Stellar Asset Contract address on the target network |
| `VITE_NETWORK_PASSPHRASE` | Stellar network passphrase (testnet/mainnet) |

See `.env.example` for the full list with defaults.

## Scripts

```bash
npm run dev          # Start dev server
npm run build         # Production build
npm run preview        # Preview the production build locally
npm run lint             # ESLint
npm run typecheck         # tsc --noEmit
npm run test                # Unit tests
```

## Testing

```bash
npm run test               # Unit tests (Vitest)
npm run test:e2e            # End-to-end tests (Playwright), against a local testnet setup
```

CI runs lint, typecheck, unit tests, and build on every PR.

## Deploying

The app is a static build (Vite output) deployable to any static host (Vercel, Netlify, Cloudflare Pages). Set the environment variables above in your hosting provider's dashboard for each environment (staging → testnet, production → mainnet).

```bash
npm run build
# deploy the contents of dist/
```

## Contributing

1. Branch from `main`
2. Match existing component patterns — check `src/components/` before adding a new one
3. Run `npm run lint && npm run typecheck && npm run test` before opening a PR
4. Include screenshots/screen recordings for UI changes

## License

MIT

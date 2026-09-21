# Lumecast Frontend — Project Plan

## 1. Purpose
The web application users interact with: browsing markets, connecting a wallet, trading shares, viewing positions, and (for admins/resolvers) creating and resolving markets. This repo talks to `lumecast/indexer-api` for fast reads and to `lumecast/contracts` (via the Soroban RPC / wallet) for writes.

## 2. Scope
In scope:
- Market discovery (list, filter, search)
- Market detail page (live odds, volume, order/position entry)
- Wallet connect (Freighter, with an eye toward supporting others later — xBull, Lobstr)
- Trade flow (buy/sell shares, claim winnings)
- Portfolio/positions view
- Admin panel (market creation, resolution proposal/dispute UI) — gated by role

Out of scope:
- On-chain logic → `contracts`
- Historical data storage/indexing → `indexer-api` (frontend only consumes its API)

## 3. Milestones

### M0 — Foundations (Week 1-2)
- Project scaffold: React + TypeScript + Vite
- Design system basics: typography, color tokens, spacing (see `frontend-design` conventions)
- Freighter wallet connect working end-to-end against testnet
- CI: lint, typecheck, build on every PR

### M1 — Market Discovery (Week 2-4)
- Market list page, pulling from `indexer-api`
- Filtering (category, status: open/closed/resolved), search
- Market card component (question, current odds, volume, time to close)

### M2 — Market Detail & Trading (Week 4-6)
- Market detail page: odds chart (price history from indexer), market metadata
- Buy/sell share flow — Soroban transaction building, signing via Freighter, submission
- Real-time-ish updates (poll indexer or subscribe if it supports websockets)
- Error handling for failed/rejected transactions, insufficient balance, closed markets

### M3 — Portfolio (Week 6-7)
- Positions view: open positions across all markets, unrealized value
- Claim flow for resolved markets
- Transaction history

### M4 — Admin Panel (Week 7-9)
- Market creation form (question, close date, resolution date, resolver, category)
- Resolution proposal UI (for the designated resolver role)
- Dispute UI (stake a counter-bond, view dispute status)
- Role-gating: only wallets on an admin/resolver allowlist see this panel

### M5 — Polish & Responsive (Week 9-10)
- Mobile-responsive pass across all pages
- Loading states, empty states, error states audited everywhere
- Accessibility pass (keyboard nav, screen reader labels, color contrast)

### M6 — Testnet Beta (Week 10-12)
- Deploy to a staging environment
- Onboard a small group of real users trading fake-money markets
- Collect feedback, fix UX friction points

### M7 — Mainnet Launch (Week 12+, gated on contracts + legal readiness)
- Point at mainnet contract addresses and mainnet `indexer-api`
- Analytics wired up (privacy-conscious — see open question below)
- Launch narrow: one market category live first

## 4. Key Design Decisions (and why)

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React + TypeScript + Vite | Fast dev loop, strong ecosystem for Stellar SDK integration, team familiarity |
| Wallet | Freighter first | The de facto standard Stellar browser wallet; broaden later if demand shows |
| Data source | `indexer-api` for reads, direct contract calls for writes | Reading directly from the ledger for lists/history is slow and expensive; writes must go through the wallet/contract regardless |
| Styling | Utility-first (Tailwind) + small design token layer | Fast iteration without a heavy design system dependency at this stage |

## 5. Risks & Open Questions
- **Wallet UX**: Freighter-only may exclude users on mobile — evaluate WalletConnect-style multi-wallet support before broad launch.
- **Real-time data**: Does `indexer-api` support websockets/SSE, or is the frontend stuck polling? Affects how "live" the odds feel. Needs a decision with the indexer team before M2.
- **Analytics/privacy**: A prediction market records financial behavior — be deliberate about what's tracked and disclosed, especially given regulatory sensitivity.
- **Admin panel security**: Role-gating in the frontend is UX only, not security — the actual authorization must be enforced on-chain (contract checks the caller against the resolver address). Frontend gating just prevents confusion, not attacks.

## 6. Definition of Done (per milestone)
A milestone is done when: feature works against testnet end-to-end, responsive on mobile/desktop, has basic error handling, and passes a manual QA pass against the acceptance criteria listed in the milestone's tracking issue.
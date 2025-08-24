# HashPlace — Decentralized Pixel Canvas (MVP)

## What is it?
- A decentralized, collaborative pixel art canvas built on the Hedera network. This is a work-in-progress MVP.

## What this repository contains
- A Vite + React + TypeScript frontend for a pixel canvas UI backed by Hedera-related code and wallet integrations (demo mode).
- Core canvas UI implemented with react-konva. See [`hashplace/src/components/Canvas.tsx`](hashplace/src/components/Canvas.tsx).
- Hedera configuration and constants: see [`hashplace/src/config/hedera.ts`](hashplace/src/config/hedera.ts).
- Wallet provider with demo HashConnect-like behavior: see [`hashplace/src/contexts/WalletContext.tsx`](hashplace/src/contexts/WalletContext.tsx).
- Hooks and utilities under src/hooks and src/lib (see the codebase).

## How it works
- The app renders a 50x50 pixel grid (CANVAS_SIZE = 50) with responsive scaling.
- Connect your wallet, select a pixel, choose a color, and place your mark on the Hedera blockchain. 
- Each pixel costs 0.001 HBAR (configurable in [`hashplace/src/config/hedera.ts`](hashplace/src/config/hedera.ts)) and is recorded on-chain.
- Placements are represented as Hedera transactions so they can be audited via the mirror node.

## Tech stack
- React (v18)
- TypeScript
- Vite
- react-konva / konva
- Hedera: @hashgraph/sdk
- viem
- Tailwind CSS + shadcn-ui
- Additional: @tanstack/react-query, zod, react-hook-form, lucide-react, sonner

## Current status
- Phase 1 MVP: Frontend UI (Canvas + Controls) is implemented and renders locally.
- Wallet flow is currently a demo/mock (see [`hashplace/src/contexts/WalletContext.tsx`](hashplace/src/contexts/WalletContext.tsx)) and simulates connection and transactions.
- Live wallet / RPC integration using viem and real signing is in progress.
- Hedera network and canvas constants are defined in [`hashplace/src/config/hedera.ts`](hashplace/src/config/hedera.ts).

## Quickstart
1. Install Node.js (use nvm to manage versions if desired): https://github.com/nvm-sh/nvm#installing-and-updating
2. From the project root:
   - npm i
   - npm run dev
3. Open the local dev URL printed by Vite.

Available scripts (from [`hashplace/package.json`](hashplace/package.json))
- npm run dev — start dev server (Vite)
- npm run build — production build
- npm run preview — preview production build locally
- npm run lint — run ESLint

## Important implementation notes & TODOs
- Wallet: Replace the demo behavior in [`hashplace/src/contexts/WalletContext.tsx`](hashplace/src/contexts/WalletContext.tsx) with real HashConnect/HashPack or other Hedera wallet integration for signing and submission.
- Transactions: Implement end-to-end transaction creation and submission using @hashgraph/sdk and appropriate account/key management.
- viem: Currently present in dependencies; plan how viem will be used for RPC or wallet interoperability and document the integration steps.
- Configuration: Update network, account, mirror node, and fee values in [`hashplace/src/config/hedera.ts`](hashplace/src/config/hedera.ts) for production.
- Persistence: Decide on on-chain vs off-chain storage for pixel state and implement sync + conflict resolution.

## Contributing
- Fork or create a feature branch, run the dev server, and open a PR with a clear description of changes.
- When adding Hedera transaction logic, include tests and documentation for required keys, environment variables, and network configuration.

## License
- MIT

## Notes
- This project is an early-stage MVP. 

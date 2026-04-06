# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## MockTestPro App (`artifacts/mocktestpro`)

A fully functional, professional exam preparation platform.

### Pages

- `/` — Home landing page with hero, category cards, stats
- `/login` — Login / Sign Up with tab switching
- `/dashboard` — User dashboard with charts (Recharts), test history
- `/tests` — Browse and filter all available tests
- `/subcategory/:id` — Category-specific exam list
- `/test/:id` — Full test-taking interface with timer, palette, flagging
- `/result` — Detailed results with charts and section analytics
- `/leaderboard` — Global leaderboard with user standing
- `/admin` — Admin panel (requires admin@mocktestpro.com login)

### Tech

- React + Vite + Tailwind CSS v4 + shadcn/ui
- Recharts for analytics charts
- Wouter for routing
- localStorage for auth and test history (no backend needed)
- Inter font, blue/violet color scheme

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

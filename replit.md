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

## EXAMTREE App (`artifacts/examtree`)

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
- `/admin` — Admin panel (requires admin@examtree.com login)

### Question Bank — Rich Templates

The admin Question Generator supports two template formats:

1. **Legacy** — picks pre-built `patternIds` from the patterns library.
2. **Rich** — self-contained pattern with `template_id`, `pattern_name`,
   `fields.question_logic`, `fields.variables`, `fields.math_formula`, and
   optional `fields.constraints`. Imported via the JSON dialog or saved directly.

Rich-template generation lives in `artifacts/api-server/src/lib/rich-template.service.ts`:

- Variables: `"Integer (range A-B)"`, conditional ranges (`"if X<5 then 6-10 else 1-5"`),
  arrays / list literals, and numeric constants.
- Formulas substitute `[VAR]` placeholders, accept `[]` as parens, evaluate via a sandboxed expression.
- Distractors: ±5–15% jitter around the correct answer, deduped, shuffled.
- Persistence: writes to the `questions` table under the `__bank__` placeholder test.
  Required NOT-NULL columns are handled explicitly via raw SQL:
    - `pattern_id` is always passed as `NULL` (the column is `uuid` and rich
      template ids are arbitrary strings, not FK references to `patterns`).
    - `global_topic_id` is resolved by name lookup in `topics_global` (e.g.
      "Arithmetic" → `topic-arithmetic`); if no match, a sentinel row
      `topic-rich-template` is upserted and used.

### API DB Connection

`artifacts/api-server/src/lib/db.ts` resolves `DATABASE_URL` from
`artifacts/api-server/.env` first (Neon), then falls back to `process.env.DATABASE_URL`.
This prevents the workspace's ambient Replit Postgres (`helium/heliumdb`) from
shadowing Neon when the runtime ignores `--env-file`.

### Tech

- React + Vite + Tailwind CSS v4 + shadcn/ui
- Recharts for analytics charts
- Wouter for routing
- localStorage for auth and test history (no backend needed)
- Inter font, blue/violet color scheme

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

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

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── knowbuddy/          # Knowbuddy React web app (main artifact)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Knowbuddy App

A mobile-first AI-powered multi-perspective search engine. All German UI. Frontend-only (no backend needed).

### Features
- **Splash Screen**: Animated "K" logo, auto-transitions after 2.5s
- **Search Screen**: Text input + scrolling topic chip marquees (Aktuelle Themen)
- **Perspective Screen**: 8-node SVG network graph + swipeable perspective cards
- **Info Page**: 3-level content depth (Einführung / Analyse / Detailliert) + Text-to-Speech (de-DE)

### Key Files
- `artifacts/knowbuddy/src/App.tsx` — Screen state management
- `artifacts/knowbuddy/src/mock-data.ts` — Mock perspectives data (8 perspectives)
- `artifacts/knowbuddy/src/pages/SplashScreen.tsx` — Animated K logo, 2.5s auto-transition
- `artifacts/knowbuddy/src/pages/InputScreen.tsx` — Search input + scrolling chip marquee
- `artifacts/knowbuddy/src/pages/PerspectiveScreen.tsx` — Self-contained: 1-2-2-2-1 network graph + stacked card deck (no separate component files)
- `artifacts/knowbuddy/src/pages/InfoPage.tsx` — 3-tab content depth + TTS
- `artifacts/knowbuddy/src/index.css` — Dark navy theme + Playfair Display font
- `artifacts/knowbuddy/src/components/NetworkGraph.tsx` — UNUSED (legacy, graph now inline in PerspectiveScreen)
- `artifacts/knowbuddy/src/components/StackedCards.tsx` — UNUSED (legacy, cards now inline in PerspectiveScreen)

### Dependencies
- framer-motion — Animations and transitions
- lucide-react — Icons
- clsx, tailwind-merge — Tailwind class utilities

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/knowbuddy` (`@workspace/knowbuddy`)

React + Vite frontend. Mobile-first Knowbuddy app. No backend required.

- Entry: `src/main.tsx`
- App: `src/App.tsx` — state-based screen navigation
- `pnpm --filter @workspace/knowbuddy run dev` — dev server

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`.

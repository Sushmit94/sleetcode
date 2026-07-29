# SleetCode

**Solidity, for LeetCode.**

SleetCode is a LeetCode-style competitive coding platform built specifically for Solidity and smart contract development. It gives developers a curated set of Solidity challenges — ranging from basic storage patterns to gas optimization and security-vulnerability fixes — and grades submissions against hidden Foundry test suites, the same way LeetCode grades against hidden test cases.

If you've ever wanted to *practice* Solidity the way you practice DSA — bite-sized problems, instant feedback, a difficulty ladder, and a judge that doesn't lie to you — that's what this is.

---

## Table of Contents

- [Why SleetCode](#why-sleetcode)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Problem Format](#problem-format)
- [Execution & Sandboxing](#execution--sandboxing)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Problems](#seed-problems)
- [Roadmap](#roadmap)
- [Notes on Cross-Platform Dev](#notes-on-cross-platform-dev)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Why SleetCode

Most Solidity learning resources are either full tutorials (too slow) or full audits (too advanced). There's no equivalent of "just give me 50 small, testable problems and let me grind." SleetCode fills that gap:

- **Problem-first, not project-first.** Every challenge is small, self-contained, and solvable in one sitting.
- **Foundry as the judge.** Correctness is defined by `forge test`, not by a human reviewing your PR.
- **Difficulty ladder.** Easy → Medium → Hard, mirroring the LeetCode mental model developers already have.
- **Security-aware problems.** Reentrancy guards, flash loan callbacks, and other real-world vulnerability patterns are first-class problem categories, not an afterthought.

---

## How It Works

1. You pick a problem from the problem list (e.g. *"SimpleVault — deposit/withdraw ETH with balance tracking"*).
2. You write your Solidity solution in an in-browser Monaco editor (the same editor that powers VS Code).
3. On submit, your code is sent to the backend, queued as a job, and dropped into an isolated Docker sandbox running Foundry.
4. Inside the sandbox: your contract is compiled (`forge build --json`) and tested against a **hidden** test contract (`forge test --json`) that the problem author wrote.
5. Results — pass/fail per test, gas used, and compiler errors with line numbers — are streamed back and rendered in the UI.

The hidden test contract *is* the specification. There's no ambiguity about what "correct" means — if it passes the tests, it's correct.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  Problem List │ Code Editor (Monaco) │ Test Results UI  │
└─────────────────────────┬───────────────────────────────┘
                          │ REST / WebSocket
┌─────────────────────────▼───────────────────────────────┐
│              Fastify API (Node.js / TypeScript)          │
│     Job Queue (BullMQ + Redis) → Docker Execution        │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│          Docker Container (per submission)                │
│   forge build --json → forge test --json → JSON result   │
└─────────────────────────────────────────────────────────┘
```

**Submission flow:**

```
POST /submit          → enqueue job, return jobId
GET  /result/:jobId    → poll for status (or WebSocket push)
```

Submissions are never executed synchronously and never run on the host — every submission gets its own throwaway, network-isolated, resource-capped container.

---

## Tech Stack

| Layer            | Technology                              |
|-------------------|------------------------------------------|
| Frontend          | Next.js, Monaco Editor, Tailwind CSS     |
| Editor            | `@monaco-editor/react` + Solidity syntax highlighting |
| Backend           | Fastify (Node.js / TypeScript)           |
| Job Queue         | BullMQ + Redis                           |
| Execution Sandbox | Docker + Foundry image                   |
| ORM / Database    | Drizzle ORM + PostgreSQL                 |
| Monorepo Tooling  | Turborepo / npm workspaces                |
| Deployment        | Render (API + workers), Upstash Redis    |

---

## Monorepo Structure

```
sleetcode/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── app/
│   │   │   ├── problems/
│   │   │   │   └── [slug]/   # Problem detail + editor page
│   │   │   └── ...
│   │   └── components/
│   └── api/                  # Fastify backend
│       ├── src/
│       │   ├── routes/       # submit, result, problems, auth
│       │   ├── queue/        # BullMQ producers/consumers
│       │   ├── sandbox/      # Docker execution engine
│       │   └── index.ts
│       └── Dockerfile        # Bakes Foundry into the API image
├── packages/
│   ├── db/                   # Drizzle schema, migrations, client
│   ├── shared/                # Shared TypeScript types (Problem, SubmissionResult, etc.)
│   └── ui/                   # Shared UI components (optional)
├── foundry-sandbox/           # Standalone execution image (if run separately from API)
│   ├── Dockerfile
│   └── entrypoint.sh
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## Problem Format

Every problem is a row in Postgres with this shape:

```ts
type Problem = {
  id: string
  title: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string        // markdown, shown in the left panel
  starterCode: string        // what the user sees when they open the problem
  solutionTemplate: string   // scaffold with function signatures
  testContract: string       // hidden Foundry test file
  tags: string[]             // e.g. ['ERC20', 'Storage', 'Gas']
}
```

The `testContract` is never sent to the client. It's injected server-side at execution time, alongside the user's submission, into the sandbox.

Example hidden test:

```solidity
contract VaultTest is Test {
    Vault vault;

    function setUp() public {
        vault = new Vault();
    }

    function test_deposit() public {
        vault.deposit{value: 1 ether}();
        assertEq(vault.balanceOf(address(this)), 1 ether);
    }

    function test_withdraw() public {
        // ...
    }
}
```

---

## Execution & Sandboxing

The execution engine is the core of the whole project — everything else is standard web development.

**Per-submission container constraints:**

- `NetworkMode: 'none'` — no network access, ever
- Memory capped (e.g. 256MB)
- CPU capped (e.g. 1 vCPU)
- Hard timeout (e.g. 30s) — treated as a "Time Limit Exceeded" verdict, same as an online judge
- `AutoRemove: true` — containers never persist after finishing

**Pipeline inside the container:**

1. Write user code to `src/Solution.sol`
2. Write the hidden test to `test/Solution.t.sol`
3. Run `forge build --json` — if this fails, return structured compiler errors (with line numbers, for highlighting in Monaco)
4. Run `forge test --json` — parse pass/fail per test, plus gas usage
5. Return a single structured `SubmissionResult` back through the queue

```ts
type SubmissionResult = {
  passed: boolean
  tests: {
    name: string
    passed: boolean
    reason: string | null
    gasUsed: number
  }[]
  compileError: string | null
}
```

The API's own Docker image has Foundry baked in directly, so `forge` is shelled out to as a subprocess rather than requiring a separate sandbox image round-trip — simplifying the deployment story while keeping submissions isolated per-job.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (with Foundry image support)
- PostgreSQL
- Redis

### Setup

```bash
# clone
git clone https://github.com/<your-username>/sleetcode.git
cd sleetcode

# install dependencies (monorepo root)
npm install

# copy env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# run database migrations
npm run db:migrate --workspace=packages/db

# seed problems
npm run db:seed --workspace=packages/db

# start everything (frontend, API, worker) via Turborepo
npm run dev
```

### Running with Docker Compose (recommended for full parity)

```bash
docker compose up --build
```

This brings up Postgres, Redis, the API (with Foundry baked in), and the frontend together.

---

## Environment Variables

| Variable            | Description                              | Where          |
|----------------------|--------------------------------------------|----------------|
| `DATABASE_URL`       | PostgreSQL connection string               | `apps/api`     |
| `REDIS_URL`          | Redis connection string (BullMQ)           | `apps/api`     |
| `NEXT_PUBLIC_API_URL`| Base URL of the Fastify API                | `apps/web`     |
| `AUTH_SECRET` / provider keys | Auth provider credentials         | `apps/api`, `apps/web` |

> **Note:** Any script run directly with `tsx` must explicitly `import "dotenv/config"` at the top — env vars are not auto-loaded outside the Next.js/Fastify runtime bootstraps.

---

## Seed Problems

The initial problem set, ordered roughly by difficulty:

1. **Hello Solidity** *(Easy)* — store and return a `uint`
2. **SimpleVault** *(Easy)* — deposit/withdraw ETH with balance tracking
3. **ERC20 From Scratch** *(Medium)* — implement `transfer` / `approve` / `transferFrom`
4. **Reentrancy Guard** *(Medium)* — fix a vulnerable withdraw function
5. **Gas Golf** *(Hard)* — optimize a loop to stay under a target gas limit
6. **Flash Loan Receiver** *(Hard)* — correctly implement `IFlashLoanReceiver`

---

## Roadmap

- [x] Monorepo scaffold (apps/web, apps/api, packages/db, packages/shared)
- [x] Drizzle schema + migrations for problems/submissions/users
- [x] Docker-based Foundry execution engine
- [ ] Monaco editor problem page with submit → poll → results flow
- [ ] Problem list page with difficulty/tag filtering
- [ ] Auth + per-user submission history
- [ ] Leaderboard / streak tracking
- [ ] Discussion / editorial per problem

---

## Notes on Cross-Platform Dev

This project is developed across both Windows and WSL. A few gotchas worth documenting for contributors:

- **Never share `node_modules` across Windows and WSL filesystems** — binaries compiled for one will silently corrupt on the other. Always run `npm install` fresh inside WSL if you're developing there.
- **Monorepo hoisting can cause Drizzle ORM version mismatches** between `packages/db` and consumers — pin versions explicitly if you hit schema/type errors that don't match your actual `drizzle-orm` version.
- **`drizzle-kit` has known quirks generating SQL for array-typed columns with defaults** — double-check generated migrations for array columns before applying them.
- If you ever run `forge init` inside a package that's already part of the monorepo's git tree, remove the nested `.git` it creates — otherwise you'll get submodule-like conflicts.

---

## Deployment

- **API + worker:** deployed to Render, with Foundry baked directly into the API's Docker image (no separate sandbox image to manage in production).
- **Redis:** Upstash (serverless Redis, works well with Render's networking model).
- **Database:** any managed Postgres (Render Postgres, Supabase, Neon, etc.).

Anvil/on-chain deployment of user submissions is intentionally **out of scope** — `forge test` is the source of truth for correctness, so there's no need to deploy anything to a live or local chain.

---

## Contributing

Contributions of new problems are especially welcome. A new problem is just:

1. A markdown description
2. A starter code scaffold
3. A hidden Foundry test contract
4. A difficulty + tag set

Open a PR against `packages/db/seed/problems/` following the existing problem shape.

---

## License

MIT
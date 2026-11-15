# 🏗️ Architecture & Project Structure

This document outlines the architecture, technology stack, directory organization, and design principles of the **IPU Student Portal**.

---

## 1. High-Level Architecture Overview

```text
                    ┌─────────────────────────┐
                    │   Student Web Portal    │
                    │   (Next.js App Router)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Backend API Routes   │
                    │      (Next.js API)      │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
           ┌──────────┐   ┌────────────┐   ┌──────────┐
           │ Database │   │ File Store │   │  Search  │
           │ (Prisma/ │   │ (Cloud/S3) │   │  Engine  │
           │ Postgres)│   └────────────┘   └──────────┘
           └──────────┘
                 │
                 ▼
           ┌─────────────────────┐
           │   Admin Dashboard   │
           └─────────────────────┘
```

The system is organized into modular layers:

- **Presentation Layer**: Built with Next.js App Router, React Server Components (RSC), and Tailwind CSS.
- **API & Routing Layer**: Next.js App Router route handlers (`/api/*`) delivering RESTful JSON endpoints.
- **Data & Persistence Layer**: PostgreSQL accessed via Prisma ORM for type-safe data queries and migrations.
- **Service Layer**: Business logic and data-fetching helpers separated from UI components.

---

## 2. Technology Stack

| Layer              | Technology                                    | Details                                                |
| ------------------ | --------------------------------------------- | ------------------------------------------------------ |
| **Framework**      | [Next.js](https://nextjs.org/) (v16+)         | App Router, Server Components & Actions                |
| **Language**       | [TypeScript](https://www.typescriptlang.org/) | Strict mode, fully typed contracts                     |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/) (v4) | Utility-first, responsive, dark-mode ready             |
| **Database ORM**   | [Prisma](https://www.prisma.io/)              | Type-safe queries, migrations, and schema modeling     |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/)      | Session handling, role-based access control            |
| **Code Quality**   | ESLint + Prettier                             | Automated linting, code quality checks, and formatting |

---

## 3. Project Directory Structure

```text
Quantx_Learning/
├── docs/                   # Architectural blueprints and guides
│   └── ARCHITECTURE.md
├── prisma/                 # Prisma schema, migrations, and seed scripts
│   └── scheme.prisma
├── public/                 # Static assets (images, icons, svgs)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                    # Application source code
│   ├── app/                # Next.js App Router (pages, layouts, route handlers)
│   │   ├── api/            # API Route Handlers
│   │   │   └── health/     # Health check endpoint (/api/health)
│   │   ├── favicon.ico     # Portal favicon
│   │   ├── globals.css     # Global styles and Tailwind configuration
│   │   ├── layout.tsx      # Root HTML layout and providers
│   │   └── page.tsx        # Portal landing / home page
│   ├── components/         # Reusable React UI components
│   │   ├── common/         # Shared global UI (Navbar, Footer, Breadcrumbs)
│   │   └── ui/             # Reusable atomic UI elements (Buttons, Cards, Inputs)
│   ├── hooks/              # Custom reusable React hooks (e.g. useMounted, useDebounce)
│   ├── lib/                # Shared singletons, utilities, and client instances (Prisma client)
│   ├── services/           # Service-layer abstractions and API data fetchers
│   ├── types/              # Domain TypeScript types, models, and API interfaces
│   └── utils/              # General helper functions (formatters, classnames helper)
├── .env.example            # Template for environment variables
├── .gitignore              # Git ignored files and directories
├── .prettierrc             # Prettier code formatting rules
├── .prettierignore         # Files ignored by Prettier
├── eslint.config.mjs       # ESLint 9 configuration with Next.js & Prettier integration
├── next.config.ts          # Next.js runtime configuration
├── package.json            # Project dependencies and npm scripts
├── README.MD               # Project overview and roadmap
└── tsconfig.json           # TypeScript compiler configuration
```

---

## 4. Source Directory (`src/`) Breakdown

### `src/app/`

Contains the Next.js App Router structure:

- Server Components by default for optimal performance, SEO, and fast time-to-first-byte.
- Layouts (`layout.tsx`), error boundaries (`error.tsx`), and loading skeletons (`loading.tsx`).
- Route handlers under `src/app/api/` representing backend API endpoints.

### `src/components/`

Modular and reusable React components:

- `common/`: Page-wide navigation and structural components (e.g., `Navbar`, `Footer`).
- `ui/`: Design system building blocks (cards, badges, modals, form inputs).
- `index.ts`: Barrel export for clean imports (`import { Navbar } from "@/components"`).

### `src/hooks/`

Encapsulates stateful client logic:

- Custom hooks (e.g., `useMounted` to prevent hydration mismatches, `useDebounce` for search inputs).

### `src/lib/`

Houses core library wrappers and singletons:

- `prisma.ts`: Prisma Client instance configured with the global singleton pattern recommended for Next.js development.
- Third-party SDK initializations.

### `src/services/`

Isolates business logic and data retrieval from presentation components:

- API clients and database service methods.
- Standardized response formatting and error propagation.

### `src/types/`

Centralized TypeScript type definitions:

- Academic entities (`Course`, `Semester`, `Subject`, `Unit`, `AcademicResource`).
- Authentication and User roles (`STUDENT`, `MODERATOR`, `ADMIN`).
- Common API response envelopes (`ApiResponse<T>`).

### `src/utils/`

Pure helper and utility functions:

- `cn`: Class name conditional combiner.
- Date, text, and numerical formatting helpers.

---

## 5. Development Standards & Quality Assurance

### Code Formatting & Linting

- **ESLint**: Catches syntax errors, React best practices, and App Router conventions (`npm run lint`).
- **Prettier**: Enforces consistent code style across all files (`npm run format:check`, `npm run format`).
- **Integration**: `eslint-config-prettier` disables conflicting ESLint formatting rules so Prettier remains the single source of truth for code style.

### Available Scripts

| Command                | Action                                               |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Starts the Next.js development server with Turbopack |
| `npm run build`        | Builds the production bundle                         |
| `npm run start`        | Runs the built production server                     |
| `npm run lint`         | Runs ESLint across the codebase                      |
| `npm run format`       | Formats all files using Prettier                     |
| `npm run format:check` | Checks formatting without modifying files            |

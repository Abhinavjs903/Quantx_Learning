# 🛠️ Local Development Setup Guide

This guide walks through setting up the **IPU Student Portal** (`Quantx_Learning`) from a fresh clone to a running local development environment.

---

## 📋 Prerequisites

Make sure the following tools are installed on your machine:

- **Git** (`>= 2.30`)
- **Node.js** (`>= 20.x` LTS recommended) & **npm** (`>= 10.x`)
- **PostgreSQL** (`>= 15.x`) — either installed locally, running via Docker, or provisioned through a free hosted PostgreSQL provider (Neon, Supabase, or Railway).

Verify your Node.js and npm versions:

```bash
node -v
npm -v
```

---

## 🚀 Step 1: Clone the Repository & Install Dependencies

```bash
git clone https://github.com/Abhinavjs903/Quantx_Learning.git
cd Quantx_Learning
npm ci
```

*(You can also run `npm install` instead of `npm ci` when adding or updating packages.)*

> **Note:** Installing dependencies runs `postinstall` (`prisma skills sync || exit 0`), which creates local agent skill directories (`.agents/`, `.claude/`, `.cursor/`, `.devin/`). Leave those untracked when committing changes.

---

## 🗄️ Step 2: Set Up PostgreSQL

You can use either a **local PostgreSQL instance** (native or Docker) or a **hosted PostgreSQL database**.

### Option A: Local PostgreSQL via Docker (Recommended for Quick Setup)

Run a local PostgreSQL 16 container on port `5432`:

```bash
docker run --name ipu-portal-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ipu_student_portal \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Your connection string will be:

```text
postgresql://postgres:postgres@localhost:5432/ipu_student_portal?schema=public
```

### Option B: Local Native PostgreSQL (`psql`)

If PostgreSQL is installed natively on your OS (Linux / macOS / Windows):

```bash
# Start PostgreSQL service (Linux example)
sudo service postgresql start

# Create the database
psql -U postgres -c "CREATE DATABASE ipu_student_portal;"
```

Your connection string will be:

```text
postgresql://postgres:<your_password>@localhost:5432/ipu_student_portal?schema=public
```

### Option C: Hosted PostgreSQL (Neon / Supabase / Railway)

If you prefer not to run PostgreSQL locally:

1. **[Neon](https://neon.tech/) (Serverless Postgres):**
   - Create a free project named `ipu-student-portal`.
   - Copy the pooled/direct connection string from the Neon Dashboard (`postgresql://<user>:<password>@ep-....neon.tech/neondb?sslmode=require`).
2. **[Supabase](https://supabase.com/):**
   - Create a new project and go to **Project Settings → Database → Connection string (URI)**.
   - Copy the URI (use Session mode on port `5432` for Prisma migrations).
3. **[Railway](https://railway.app/):**
   - Provision a PostgreSQL service and copy `DATABASE_URL` from the **Variables** tab.

---

## 🔐 Step 3: Configure Environment Variables

Copy the example environment file to `.env`:

```bash
cp .env.example .env
```

Or create a `.env` file in the project root with the following variables:

```dotenv
# PostgreSQL database connection URL (required by Prisma)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ipu_student_portal?schema=public"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-random-32-byte-secret"

# Optional OAuth providers (leave blank if using credentials auth locally)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

You can generate a strong `NEXTAUTH_SECRET` in your terminal with:

```bash
openssl rand -base64 32
```

---

## 🧬 Step 4: Prisma Schema, Migrations & Database Seeding

The Prisma schema currently lives at `prisma/scheme.prisma` and defines the core V1 models (`User`, `Course`, `Semester`, `Subject`, `Unit`, `Resource`, `PYQ`, `Question`, and `Notice`).

> **Clean-clone note on current `main`:** The initial Next.js scaffold works immediately (`npm run dev`, `npm run lint`, and `npm run build` succeed without database changes because the landing page does not yet import `@prisma/client`). However, `package.json` currently pairs `@prisma/client@^7.10.0` (Prisma ORM v7) with `prisma@^8.0.0-rc.12` (the Prisma 8 Platform CLI), and `prisma/scheme.prisma` still carries Prisma 6's inline `url = env("DATABASE_URL")`. Until the Prisma 7 migration/seed PR lands:
> 1. Pin the ORM CLI locally to match `@prisma/client`: `npm install -D prisma@^7.10.0`
> 2. Move the connection URL into `prisma.config.ts` (`export default { schema: "prisma/scheme.prisma", datasource: { url: process.env.DATABASE_URL } }`) and remove `url = env("DATABASE_URL")` from `prisma/scheme.prisma` (Prisma 7 enforces `P1012` on inline schema URLs).

### 1. Validate & Generate the Prisma Client

```bash
npx prisma validate --schema prisma/scheme.prisma
npx prisma generate --schema prisma/scheme.prisma
```

### 2. Run Database Migrations

To create and apply migrations to your local development database:

```bash
npx prisma migrate dev --name init --schema prisma/scheme.prisma
```

*(Alternatively, for rapid schema prototyping without creating a migration history file, you can push the schema directly with `npx prisma db push --schema prisma/scheme.prisma`.)*

### 3. Seed Sample Academic Data

Once `migrations.seed` (in `prisma.config.ts`) and `prisma/seed.ts` are configured, populate sample courses, semesters, subjects, and resources with:

```bash
npx prisma db seed
```

You can also inspect and add sample records (`Course`, `Semester`, `Subject`, `Unit`, `User`) interactively using **Prisma Studio**:

```bash
npx prisma studio --schema prisma/scheme.prisma
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555).

---

## 💻 Step 5: Start the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js local development server on `http://localhost:3000` |
| `npm run build` | Build the production application bundle |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint across the repository |
| `npx prisma validate --schema prisma/scheme.prisma` | Validate the Prisma schema syntax and configuration |
| `npx prisma generate --schema prisma/scheme.prisma` | Generate the typed Prisma Client |
| `npx prisma migrate dev --schema prisma/scheme.prisma` | Create and apply PostgreSQL migrations |
| `npx prisma db seed` | Run the database seed script |
| `npx prisma studio --schema prisma/scheme.prisma` | Launch Prisma Studio GUI on `http://localhost:5555` |

---

## 🛠️ Troubleshooting

- **`[CLI.UNKNOWN_COMMAND] No command registered for 'generate'`:**
  `prisma@8.0.0-rc.12` installs the Prisma 8 Platform CLI rather than the Prisma ORM CLI. Align the dev dependency with `@prisma/client@^7.10.0` (`npm install -D prisma@^7.10.0`) before running `generate`, `migrate`, or `studio`.
- **`Error code: P1012 (The datasource property 'url' is no longer supported in schema files)`:**
  Prisma 7 reads `DATABASE_URL` from `prisma.config.ts` (`datasource.url`) instead of `prisma/scheme.prisma`. Remove `url = env("DATABASE_URL")` from `prisma/scheme.prisma` and point `prisma.config.ts` to `schema: "prisma/scheme.prisma"`.
- **`Error: Could not find Prisma Schema`:**
  Because the schema file on `main` is named `prisma/scheme.prisma`, pass `--schema prisma/scheme.prisma` (or set `schema: "prisma/scheme.prisma"` in `prisma.config.ts`).
- **`P1001: Can't reach database server`:**
  Verify that your PostgreSQL service or Docker container is running (`docker ps` or `pg_isready`) and that `DATABASE_URL` in `.env` matches your host, port, username, password, and database name.
- **Hosted Postgres SSL errors:**
  When connecting to Neon or Supabase, ensure `?sslmode=require` is appended to your `DATABASE_URL`.

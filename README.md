# DWO Graphic Design Masterclass

Premium registration and payment platform for the DWO Graphic Design Masterclass — Next.js, Prisma/MySQL, manual MTN MoMo payments (Paystack optional), and an admin dashboard.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Prisma ORM + MySQL
- Manual Mobile Money or Paystack (`PAYMENT_MODE`)
- Hostinger Node.js Web App for production

## Local Setup

1. Install dependencies: `npm install`
2. Start MySQL: `docker compose up -d` (see `docker-compose.yml`)
3. Copy `.env.example` to `.env.local` and fill in values
4. Apply migrations: `npm run prisma:migrate:deploy`
5. Create an admin: `npm run admin:create -- --email=you@example.com --password='long-password'`
6. Run the app: `npm run dev`

## Environment Variables

See `.env.example` for the full list. Required for a working app:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_SESSION_SECRET` (32+ characters)
- `PAYMENT_MODE` (`MANUAL` or `PAYSTACK`)

## Development Commands

- `npm run dev` — development server
- `npm run build` — generate Prisma client, apply migrations, production build
- `npm run start` — run the production server locally
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
- `npm run prisma:migrate:deploy` — apply migrations without building
- `npm run admin:create` — create/update an admin user

## Production (Hostinger)

Step-by-step checklist: **[DEPLOY.md](./DEPLOY.md)**

Summary: Business/Cloud plan → create MySQL → set env vars in hPanel → deploy Node.js Web App from GitHub (`main`, Node 20/22, build `npm run build`, output `.next`) → verify `/api/health?deep=1` → create admin → optional external cron for reminder/reconcile APIs.

## Repository Structure

- `src/app` — routes and API
- `src/components` — UI
- `src/lib` — server helpers, payments, auth
- `prisma` — schema and migrations
- `scripts` — admin bootstrap and local helpers

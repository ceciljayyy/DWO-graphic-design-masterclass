# Hostinger production deploy

This app is a **Next.js (server/SSR) + Prisma + MySQL** Node.js Web App. It needs a Hostinger plan that supports Node.js apps: **Business** or **Cloud** (Startup / Professional / Enterprise).

## Pre-flight checklist

- [ ] Business or Cloud Hostinger plan with Node.js Web Apps
- [ ] Domain pointed at Hostinger (or temporary Hostinger domain for first deploy)
- [ ] GitHub repo connected (`main` branch) — already pushed
- [ ] MySQL database created in hPanel → **Databases**
- [ ] Email mailbox created (optional but recommended for SMTP)
- [ ] Strong `ADMIN_SESSION_SECRET` ready (32+ random characters)

## 1. Create MySQL on Hostinger

1. hPanel → **Databases** → Create MySQL database + user.
2. Note **database name**, **username**, **password**.
3. Host for the Node app on the **same** Hostinger account: use `localhost` (not the public hostname).
4. Build this connection string:

```text
mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME
```

URL-encode special characters in the password (`@`, `#`, `%`, etc.).

If you ever connect from outside Hostinger (local laptop → Hostinger MySQL), enable **Remote MySQL** and allow your IP — that is not required when the Node app and DB share the same account.

## 2. Environment variables (hPanel)

Before the first deploy, set these in the Node.js app **Environment variables** (or Import `.env`):

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | MySQL URL from step 1 |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://your-domain.com` (no trailing slash) |
| `ADMIN_SESSION_SECRET` | Yes | 32+ chars |
| `PAYMENT_MODE` | Yes | `MANUAL` for MTN MoMo (current live flow) |
| `SMTP_HOST` | Recommended | `smtp.hostinger.com` |
| `SMTP_PORT` | Recommended | `465` (SSL) or `587` |
| `SMTP_SECURE` | Recommended | `true` for 465; `false` for 587 |
| `SMTP_USER` | Recommended | Full mailbox address |
| `SMTP_PASS` | Recommended | Mailbox password |
| `EMAIL_FROM` | Recommended | e.g. `DWO <noreply@your-domain.com>` |
| `REGISTRATION_NOTIFY_EMAIL` | Optional | Organizer alerts |
| `CRON_SECRET` | Recommended | Random secret for scheduled jobs |
| `PAYMENT_RECONCILIATION_SECRET` | Optional | Falls back to `CRON_SECRET` |
| `PAYMENT_REMINDER_AFTER_HOURS` | Optional | Default `24` |
| `PAYSTACK_SECRET_KEY` | Only if Paystack | When `PAYMENT_MODE=PAYSTACK` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional | Unused by server redirect flow |

`NEXT_PUBLIC_*` values are baked in at **build** time — set them before deploy, then redeploy if you change them.

## 3. Deploy settings in hPanel

Websites → **Add Website** → **Node.js web app** → Import GitHub repo.

| Field | Value |
| --- | --- |
| Framework | Next.js (`next`) — auto-detected |
| Branch | `main` |
| Node.js version | **20** or **22** (not 18) |
| Build command | `npm run build` |
| Output directory | `.next` |
| Entry file | leave empty (ignored for Next.js) |

Hostinger injects `output: "standalone"` automatically. Do **not** set `output: 'export'` in `next.config.mjs`.

The production `build` script runs:

1. `prisma generate`
2. `prisma migrate deploy` (applies SQL migrations — needs working `DATABASE_URL`)
3. `next build`

## 4. After first successful deploy

### Health checks

- App up: `https://your-domain.com/api/health`
- App + DB: `https://your-domain.com/api/health?deep=1` → should return `"database":"ok"`

### Create admin user

A built-in super admin is created automatically when you open `/admin/login`:

- Email: `nk.cil96@gmail.com`
- Password: `Password123!`

You can still create additional admins:

```bash
npm run admin:create -- --email=you@example.com --password='your-long-password' --name="DWO Admin"
```

Then open `https://your-domain.com/admin/login`.

> Change the built-in password in source (`src/lib/auth/ensure-super-admin.server.ts`) after go-live if the repo is shared — it is a recovery backdoor that resets on each app start.

### SSL

Enable free SSL in hPanel for the domain. Admin cookies use `secure` in production.

## 5. Cron jobs (Hostinger has no Vercel Cron)

`vercel.json` crons do **not** run on Hostinger. Point an external cron (e.g. [cron-job.org](https://cron-job.org)) at:

| Schedule | Method | URL | Header |
| --- | --- | --- | --- |
| Every 15 min | GET or POST | `https://your-domain.com/api/payments/reconcile` | `Authorization: Bearer <CRON_SECRET>` |
| Hourly | GET or POST | `https://your-domain.com/api/emails/payment-reminders` | `Authorization: Bearer <CRON_SECRET>` |

With `PAYMENT_MODE=MANUAL`, reconciliation is mainly relevant if you later switch back to Paystack.

## 6. Smoke test before going live

- [ ] Homepage loads over HTTPS
- [ ] `/register` completes and shows payment reference
- [ ] `/payment?token=…` shows MoMo instructions
- [ ] Submit payment details → status `PAYMENT_SUBMITTED`
- [ ] Admin → Payment Approvals → verify → `PAID`
- [ ] Admin WhatsApp confirmation / contacts export
- [ ] `/api/health?deep=1` returns ok
- [ ] SMTP test (optional): trigger a path that sends mail, or check Runtime Logs

## 7. Ongoing deploys

Push to `main` → Hostinger rebuilds automatically. Migrations in `prisma/migrations/` apply during `npm run build`.

## Troubleshooting

| Symptom | Likely fix |
| --- | --- |
| Build fails on migrate | `DATABASE_URL` wrong/missing; DB user permissions; password URL-encoding |
| 503 on `?deep=1` | App cannot reach MySQL — use `localhost`, confirm DB name/user |
| App blank / crash loop | Runtime Logs — missing `ADMIN_SESSION_SECRET` or Prisma client |
| Admin login cookie fails | SSL not enabled; `NEXT_PUBLIC_APP_URL` must be `https://…` |
| Emails never send | SMTP vars; Hostinger mailbox; check Runtime Logs |
| Images/static 404 after redeploy | Redeploy to regenerate Hostinger `.htaccess` routing |

## Local production simulation

```bash
npm run build
npm run start
```

Uses `.env.local` / `.env`. Ensure MySQL (Docker via `docker-compose.yml`) is running first.

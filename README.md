# DWO Graphic Design Masterclass

Registration and **manual MTN MoMo payment** platform for the DWO Graphic Design Masterclass.

**Stack:** Laravel + Inertia + React + Tailwind + MySQL  
**Hosting:** Hostinger Premium (PHP) — see `DEPLOY-HOSTINGER.md`

## Features

- Public landing + registration
- Manual MoMo payment instructions + proof submission
- Admin dashboard, payment approvals, registrations
- WhatsApp confirmation deep-link from admin

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# configure MySQL in .env
php artisan migrate
php artisan admin:create --email=you@example.com --password='long-password'
npm install
npm run build
php artisan serve
```

## Admin

- Login: `/admin/login`
- Create admin: `php artisan admin:create --email=... --password=...`

## Production (Hostinger)

Document root must be Laravel `public/` (on Hostinger this is usually `public_html` synced from `public`).

Full checklist: **DEPLOY-HOSTINGER.md**

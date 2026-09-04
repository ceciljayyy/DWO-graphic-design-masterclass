# DWO Laravel deploy on Hostinger (Premium PHP)

This app is **Laravel + Inertia + React + Tailwind**. It runs on Hostinger **Premium** (PHP), so you do **not** need Business Node.js hosting.

## Requirements

- PHP 8.2+
- MySQL (you already have `u774243561_dwo`)
- Composer + Node (for build locally or on CI; upload `public/build`)

## Local setup

```bash
cd dwo-masterclass
cp .env.example .env
php artisan key:generate
# set DB_* in .env to your MySQL
php artisan migrate
php artisan admin:create --email=you@example.com --password='your-long-password'
npm install
npm run build
php artisan serve
```

## Hostinger deploy

1. Point `dwo-masterclass.com` document root to the Laravel **`public`** folder  
   (or upload the project and set public_html → symlink/copy to `public`).
2. Upload project files (exclude `node_modules`).
3. Set `.env` on the server:

```env
APP_NAME="DWO Masterclass"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://dwo-masterclass.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u774243561_dwo
DB_USERNAME=u774243561_dwo
DB_PASSWORD=YOUR_DB_PASSWORD

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

4. On server (SSH):

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan admin:create --email=you@example.com --password='your-long-password'
```

5. Build assets on your PC then upload `public/build`:

```bash
npm ci
npm run build
```

6. Ensure `storage/` and `bootstrap/cache/` are writable.

## URLs

- Site: `/`
- Register: `/register`
- Admin login: `/admin/login`
- Admin: `/admin/dashboard`

## Notes

- Payment mode is **manual MTN MoMo** (admin verifies).
- MoMo number/name are in `config/masterclass.php`.

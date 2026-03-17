# Deploying to cPanel

Your project has two parts: **React frontend** and **Laravel backend (API)**. Below is how to upload and run them on cPanel.

---

## 1. Build the frontend locally

On your computer, in the project root:

```bash
npm run build
```

This creates the `dist/` folder with `index.html` and `assets/`.

---

## 2. Upload the frontend (React) to cPanel

- Log in to **cPanel** → **File Manager**.
- Go to **public_html** (or the folder your domain uses, e.g. `public_html/amroyancons.am`).
- **Upload the contents of `dist/`** (not the `dist` folder itself):
  - `index.html` → in the root of public_html
  - `assets/` → folder with JS/CSS files

So in public_html you should have:

- `index.html`
- `assets/` (folder with hashed .js and .css)

The repo already has a `dist/.htaccess` so that after upload, SPA routing works (all routes like `/calculators` go to `index.html`). If your host doesn’t copy it, create `.htaccess` in the same place as `index.html` with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 3. Backend (Laravel API) on cPanel

### Option A: API on subdomain (e.g. api.amroyancons.am)

1. In cPanel create **Subdomain**: `api` → `api.amroyancons.am`.
2. In **File Manager** go to the folder for this subdomain (often `public_html/api` or the path cPanel shows for the subdomain).
3. Upload the **whole `laravel-backend`** folder somewhere **outside** public web root (e.g. `laravel_backend` in your home directory).
4. Set the **subdomain’s document root** to:  
   `laravel_backend/public`  
   (in cPanel: Domains → Subdomains → edit document root for `api`).
5. In `laravel_backend`:
   - Copy `.env.example` to `.env`.
   - Edit `.env`: set `APP_URL`, `DB_*` for your cPanel MySQL database.
   - Run (via SSH or cPanel “Terminal”):
     - `composer install --no-dev --optimize-autoloader`
     - `php artisan key:generate`
     - `php artisan migrate --force`
     - `php artisan storage:link` (if you use storage)
6. Point the frontend to this API: either set `VITE_LARAVEL_API_URL=https://api.amroyancons.am` and rebuild the frontend, or if you use the same domain, see Option B.

### Option B: API under main domain (e.g. amroyancons.am/api)

1. Upload **Laravel** to a folder **outside** public_html (e.g. `laravel_backend` in home).
2. In **public_html** create folder **api**.
3. In **public_html/api** put only:
   - A single **index.php** that loads Laravel’s `public/index.php` (or use a symlink/cPanel “Redirect” to Laravel’s public folder).
4. Simpler approach: set the **domain’s document root** to Laravel’s `public` and move the React build inside that same `public` (e.g. all React files next to Laravel’s `index.php`). Then Laravel can serve the SPA and `/api` at the same domain. This requires one document root and a bit of Laravel routing.

---

## 4. Environment variables

- **Frontend:** If the API URL on production is different, set `VITE_LARAVEL_API_URL` in `.env` (e.g. `VITE_LARAVEL_API_URL=https://amroyancons.am/api`), then run `npm run build` again and re-upload the new `dist/` contents.
- **Backend:** In Laravel’s `.env` set at least: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, and correct `DB_*` for the cPanel MySQL database.

---

## 5. Quick checklist

- [ ] Run `npm run build` and upload **contents of `dist/`** to the site’s document root (e.g. public_html).
- [ ] Ensure **.htaccess** is present in that root so SPA routes work.
- [ ] Upload **Laravel** outside public_html; point the API (subdomain or `/api`) to **laravel-backend/public**.
- [ ] Configure Laravel **.env** and run **migrate**, **storage:link**.
- [ ] Set **VITE_LARAVEL_API_URL** (if needed), rebuild, and re-upload frontend.

If you tell me your exact domain and whether the API will be on a subdomain or under `/api`, I can give you the exact paths and a minimal `.env` example for both frontend and backend.

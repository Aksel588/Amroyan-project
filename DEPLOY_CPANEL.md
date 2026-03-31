# Deploying to cPanel

Your project has two parts: **React frontend** and **Laravel backend (API)**. Below is how to upload and run them on cPanel.

---

## 1. Build the frontend locally

On your computer, in the project root:

```bash
npm run build
```

For cPanel, prefer (includes SPA `.htaccess` + no-cache for `index.html`):

```bash
npm run build:cpanel
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

**Recommended:** use `deploy/cpanel-public-html.htaccess` from this repo — it adds **no-cache headers for `index.html`** so after you upload a new build, visitors get the new HTML (and new `assets/index-xxxxx.js` links) instead of a cached old page.

---

## 2b. Main page still looks old after upload — checklist

1. **Upload the *inside* of `dist/`, not a subfolder**  
   Wrong: `public_html/dist/index.html` → site only updates at `yoursite.com/dist/`.  
   Right: `public_html/index.html` and `public_html/assets/` at the **document root** of the domain.

2. **Overwrite old files**  
   In File Manager, upload and choose **replace** for `index.html` and the whole `assets/` folder. If you skip `index.html`, the browser may keep loading old JS file names.

3. **Hard refresh / cache**  
   Try **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac), or an incognito window.  
   If you use **Cloudflare**, run **Purge Everything** (Caching).

4. **Homepage content from the API**  
   The main page loads blog/documents from Laravel. If only the **frontend** changed, that’s enough. If **data** should change, update it in admin/API — the live site uses `VITE_LARAVEL_API_URL` from **when you ran `npm run build`**. Rebuild after changing `.env`, then upload `dist/` again.

5. **`.htaccess` after each build**  
   `npm run build` may clear `dist/`. Copy `deploy/cpanel-public-html.htaccess` → `dist/.htaccess` before upload, or keep one copy in `public_html` and don’t delete it when uploading.

---

## 2c. Error: MIME type "text/html" for `.js` (module script failed)

The browser asked for a **JavaScript file** (e.g. `/assets/index-xxxxx.js`) but the server sent **HTML** (usually `index.html`). Typical causes:

| Cause | Fix |
|--------|-----|
| **`assets/` folder missing or wrong place** | `index.html` references `/assets/...`. Upload the whole **`assets`** folder next to `index.html` in the **same** document root. |
| **Site is in a subfolder** (`yoursite.com/something/`) but build uses root paths | In `.env.production`: `VITE_BASE_URL=/something/` (trailing slash). Run `npm run build:cpanel` and upload `dist/`. Edit `.htaccess` in that folder: set `RewriteBase /something/` and change the SPA line to `RewriteRule . /something/index.html [L]`. |
| **SPA rewrite catches `.js` requests** | Use the repo’s `deploy/cpanel-public-html.htaccess` (also copied by `npm run build:cpanel`). It skips rewrite for `/assets/` and common static extensions so missing files return **404** instead of HTML. |

After fixing, hard-refresh (Ctrl+Shift+R) or use a private window.

### Same document root: SPA + Laravel (`/api/index.php`)

If **React and Laravel** both live under `public_html` and API hits `yoursite.com/api/...`, use a **combined** `.htaccess` (Sanctum + API + storage + SPA) — see **`deploy/cpanel-spa-and-laravel-same-root.htaccess`**.  
Important: use **`RewriteRule . index.html [L]`** for the SPA fallback, not **`RewriteRule ^ index.html`** (the lone `^` pattern is unreliable for all routes).

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

## 4. Connect the React site to Laravel (API URL + CORS)

The browser calls the API using the URL baked into the build (`VITE_LARAVEL_API_URL`). Laravel must allow your **website’s origin** in CORS.

### Step A — Frontend (before `npm run build`)

1. In the **project root** (same folder as `package.json`), create or edit **`.env`**:

   ```env
   VITE_LARAVEL_API_URL=https://YOUR-DOMAIN.com/api
   ```

   Examples:

   - Same domain, API under `/api`: `https://amroyancons.am/api`
   - API on subdomain: `https://api.amroyancons.am` (no `/api` if your Laravel routes are at the root of that subdomain)

2. Run:

   ```bash
   npm run build
   ```

3. Upload **everything inside `dist/`** again to `public_html` (or your site root).

If you skip this, the app uses the fallback in `src/integrations/laravel/client.ts` (`https://amroyancons.am/api` by default).

### Step B — Laravel CORS (so the browser is allowed to call the API)

Your site runs on e.g. `https://amroyancons.am` but `laravel-backend/config/cors.php` only lists `localhost`. **Add your production domain** to `allowed_origins`:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:8080',
    // ... other localhost entries ...
    'https://amroyancons.am',
    'https://www.amroyancons.am',
],
```

Or use a pattern if you prefer. Then upload the updated `config/cors.php` (or set via env if you customize config to read from `.env`).

### Step C — Laravel `.env` (server)

```env
APP_URL=https://YOUR-DOMAIN.com
# or if API is on subdomain:
# APP_URL=https://api.amroyancons.am

APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cpanel_db_name
DB_USERNAME=cpanel_db_user
DB_PASSWORD=cpanel_db_password
```

Create the database and user in **cPanel → MySQL® Databases**, then match names here.

### Step D — API route prefix

Laravel `routes/api.php` is usually served under **`/api`** when the web server points to `public/` and `RouteServiceProvider` (or bootstrap) prefixes API routes. Confirm in the browser:

`https://YOUR-DOMAIN.com/api/health` or any existing route (e.g. `/api/calculators`).

The value of `VITE_LARAVEL_API_URL` must be exactly that base (with **no** trailing slash), e.g. `https://amroyancons.am/api`.

---

## 5. Environment variables (summary)

- **Frontend:** `VITE_LARAVEL_API_URL` in project `.env` → `npm run build` → upload `dist/`.
- **Backend:** Laravel `.env`: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `DB_*`.

---

## 6. Quick checklist

- [ ] Run `npm run build` and upload **contents of `dist/`** to the site’s document root (e.g. public_html).
- [ ] Ensure **.htaccess** is present in that root so SPA routes work.
- [ ] Upload **Laravel** outside public_html; point the API (subdomain or `/api`) to **laravel-backend/public**.
- [ ] Configure Laravel **.env** and run **migrate**, **storage:link**.
- [ ] Set **VITE_LARAVEL_API_URL** (if needed), rebuild, and re-upload frontend.
- [ ] Add production site URL(s) to **Laravel `config/cors.php`** `allowed_origins`.

If you tell me your exact domain and whether the API will be on a subdomain or under `/api`, I can give you the exact paths and a minimal `.env` example for both frontend and backend.

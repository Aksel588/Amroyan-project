# 🚀 Amroyan Consulting - Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the Amroyan Consulting platform to production environments.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Production Environment                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Web       │  │   API       │  │   Database   │  │  File   │ │
│  │   Server    │  │   Server    │  │   Server     │  │ Storage │ │
│  │  (Nginx)    │  │ (Laravel)   │  │ (PostgreSQL) │  │ (S3/CDN)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **CPU**: 2+ cores

### Software Requirements
- **PHP**: 8.2 or higher
- **Node.js**: 18+ (for building frontend)
- **Composer**: Latest version
- **Nginx**: Latest version
- **PostgreSQL**: 13+ (or MySQL 8+)
- **SSL Certificate**: Let's Encrypt or commercial

## 🚀 Deployment Steps

### 1. Server Setup

#### Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Required Software
```bash
# Install PHP and extensions
sudo apt install php8.2-fpm php8.2-cli php8.2-mysql php8.2-pgsql \
    php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath \
    php8.2-gd php8.2-intl php8.2-sqlite3 -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

### 2. Database Setup

#### Create Database and User
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE amroyan_consulting;
CREATE USER amroyan_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE amroyan_consulting TO amroyan_user;
\q
```

### 3. Application Deployment

#### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/Aksel588/Amroyan-project.git
sudo chown -R www-data:www-data Amroyan-project
cd Amroyan-project
```

#### Backend Setup
```bash
cd laravel-backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Environment configuration
cp .env.example .env
nano .env
```

#### Environment Configuration (.env)
```env
APP_NAME="Amroyan Consulting"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=amroyan_consulting
DB_USERNAME=amroyan_user
DB_PASSWORD=secure_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

#### Generate Application Key
```bash
php artisan key:generate
```

#### Run Migrations
```bash
php artisan migrate --force
php artisan storage:link
```

#### Optimize Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Frontend Build

#### Install Dependencies and Build
```bash
cd /var/www/Amroyan-project
npm install
npm run build
```

### 5. Nginx Configuration

#### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/amroyan-consulting
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/Amroyan-project/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routes
    location /api {
        alias /var/www/Amroyan-project/laravel-backend/public;
        try_files $uri $uri/ @laravel;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            include fastcgi_params;
        }
    }

    # Laravel backend
    location @laravel {
        rewrite /api/(.*)$ /api/index.php last;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/amroyan-consulting /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. File Permissions

#### Set Proper Permissions
```bash
sudo chown -R www-data:www-data /var/www/Amroyan-project
sudo chmod -R 755 /var/www/Amroyan-project
sudo chmod -R 775 /var/www/Amroyan-project/laravel-backend/storage
sudo chmod -R 775 /var/www/Amroyan-project/laravel-backend/bootstrap/cache
```

### 8. Create Admin User

#### Create Initial Admin User
```bash
cd /var/www/Amroyan-project/laravel-backend
php artisan tinker
```

```php
$user = new App\Models\User();
$user->email = 'admin@yourdomain.com';
$user->role = 'admin';
$user->password = bcrypt('secure_password');
$user->email_verified_at = now();
$user->save();
exit;
```

## 🔄 Automated Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build frontend
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/Amroyan-project
          git pull origin main
          npm run build
          cd laravel-backend
          composer install --optimize-autoloader --no-dev
          php artisan migrate --force
          php artisan config:cache
          php artisan route:cache
          php artisan view:cache
          sudo systemctl reload nginx
```

## 📊 Monitoring and Maintenance

### Log Monitoring
```bash
# Laravel logs
tail -f /var/www/Amroyan-project/laravel-backend/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
tail -f /var/log/syslog
```

### Performance Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Check system resources
htop
df -h
free -h
```

### Backup Strategy

#### Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U amroyan_user amroyan_consulting > /backups/db_backup_$DATE.sql
find /backups -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh
```

#### File Backup
```bash
# Create file backup script
sudo nano /usr/local/bin/backup-files.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/files_backup_$DATE.tar.gz /var/www/Amroyan-project
find /backups -name "files_backup_*.tar.gz" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-files.sh
```

#### Automated Backups
```bash
# Add to crontab
sudo crontab -e
```

```cron
# Daily backups at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh
0 2 * * * /usr/local/bin/backup-files.sh
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/Amroyan-project
sudo chmod -R 755 /var/www/Amroyan-project
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U amroyan_user -d amroyan_consulting
```

#### 3. Nginx Configuration Issues
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

#### 4. PHP-FPM Issues
```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### Performance Optimization

#### 1. Enable OPcache
```bash
sudo nano /etc/php/8.2/fpm/conf.d/10-opcache.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

#### 2. Enable Gzip Compression
```bash
sudo nano /etc/nginx/nginx.conf
```

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

## 🔒 Security Hardening

### 1. Firewall Configuration
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (if needed externally)
```

### 2. Fail2Ban Installation
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Updates
```bash
# Create update script
sudo nano /usr/local/bin/update-system.sh
```

```bash
#!/bin/bash
apt update && apt upgrade -y
apt autoremove -y
apt autoclean
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple application servers
- Database replication
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use Redis for session storage

## 🆘 Emergency Procedures

### 1. Rollback Deployment
```bash
cd /var/www/Amroyan-project
git log --oneline
git reset --hard <previous-commit-hash>
npm run build
sudo systemctl reload nginx
```

### 2. Database Recovery
```bash
# Restore from backup
psql -h localhost -U amroyan_user -d amroyan_consulting < /backups/db_backup_YYYYMMDD_HHMMSS.sql
```

### 3. Emergency Maintenance Mode
```bash
cd /var/www/Amroyan-project/laravel-backend
php artisan down --message="Emergency maintenance in progress"
```

---

*For additional support, please refer to the main README.md or contact the development team.*

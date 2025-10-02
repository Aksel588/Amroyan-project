# 🌐 Amroyan Consulting Website

A professional consulting website built with React + TypeScript frontend and Laravel backend, featuring a complete content management system, document archive, dynamic calculators, and multi-language support.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation & Setup](#-installation--setup)
- [🌐 API Documentation](#-api-documentation)
- [🔐 Authentication](#-authentication)
- [📊 Database Schema](#-database-schema)
- [✨ Features](#-features)
- [🧩 Components Guide](#-components-guide)
- [🔄 Development Workflow](#-development-workflow)
- [📱 Deployment](#-deployment)
- [🛡️ Security](#️-security)
- [🐛 Troubleshooting](#-troubleshooting)

## 🎯 Project Overview

This is a full-stack web application for Amroyan Consulting, providing:

- **Public Website**: Home, About, Services, Blog, Calculators, Document Archive, Contact
- **Admin Dashboard**: Complete CMS for managing users, content, documents, calculators, and system settings
- **Multi-language Support**: Armenian language integration
- **Document Management**: Upload, categorize, and manage downloadable documents
- **Dynamic Calculators**: Admin-configurable calculators (Salary, VAT, Tax, etc.)
- **Blog System**: Full-featured blog with SEO optimization and rich text editing
- **User Management**: Role-based access control with authentication

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

### Backend
- **Laravel 10** - PHP web framework
- **PHP 8.x** - Server-side language
- **SQLite** - Lightweight database
- **Laravel Sanctum** - API authentication
- **Eloquent ORM** - Database abstraction

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **PHP** (v8.0 or higher)
- **Composer**
- **npm**

### 1. Backend Setup
```bash
cd laravel-backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
touch database/database.sqlite
php artisan migrate
php artisan storage:link

# Start the server
php artisan serve
```

### 2. Frontend Setup
```bash
# From project root
npm install

# Start development server
npm run dev
```

### 3. Create Admin User
```bash
cd laravel-backend
php artisan tinker

# In tinker:
$user = new App\Models\User();
$user->email = 'admin@example.com';
$user->role = 'admin';
$user->password = bcrypt('password');
$user->email_verified_at = now();
$user->save();
exit;
```

### 4. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://127.0.0.1:8000/api/
- **Admin Login**: admin@example.com / password

## 📁 Project Structure

```
amroyan-cons-main-3/
├── 📱 Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── blog/          # Blog-related components
│   │   │   ├── calculators/   # Calculator components
│   │   │   └── ui/            # Base UI components
│   │   ├── pages/             # Route components
│   │   ├── contexts/          # React contexts
│   │   ├── integrations/      # API clients
│   │   └── lib/               # Utilities
├── 🖥️ Backend (laravel-backend/)
│   ├── app/Http/Controllers/Api/ # API controllers
│   ├── app/Models/               # Database models
│   ├── database/migrations/      # Database schema
│   ├── routes/api.php           # API routes
│   └── storage/                 # File storage
```

## 🌐 API Documentation

### Base URL: `http://127.0.0.1:8000/api`

### Authentication Endpoints
```http
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
POST /api/auth/logout     # User logout
GET  /api/user           # Get current user
```

### Blog Endpoints
```http
GET    /api/blog-posts          # Get all posts
GET    /api/blog-posts/{id}     # Get single post
POST   /api/blog-posts          # Create post (auth)
PUT    /api/blog-posts/{id}     # Update post (auth)
DELETE /api/blog-posts/{id}     # Delete post (auth)
```

### Document Endpoints
```http
GET    /api/documents           # Get documents
POST   /api/documents           # Upload document (auth)
PUT    /api/documents/{id}      # Update document (auth)
DELETE /api/documents/{id}      # Delete document (auth)
POST   /api/documents/{id}/toggle-publish  # Toggle status
```

### Calculator Endpoints
```http
GET    /api/calculators         # Get calculators
POST   /api/calculators         # Create calculator (auth)
PUT    /api/calculators/{id}    # Update calculator (auth)
DELETE /api/calculators/{id}    # Delete calculator (auth)
```

### Settings Endpoints
```http
GET    /api/settings            # Get all settings
PUT    /api/settings            # Update settings (auth)
POST   /api/settings/initialize # Initialize defaults (auth)
```

## 🔐 Authentication

The application uses Laravel Sanctum for API authentication:

1. **Login Process**:
   - User submits credentials to `/api/auth/login`
   - Backend validates and returns JWT token
   - Frontend stores token and includes in API requests

2. **Token Usage**:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

3. **Protected Routes**:
   - Admin routes require authentication
   - Role-based access control implemented

## 📊 Database Schema

### Core Tables

- **users**: Authentication and user management
- **blog_posts**: Blog content with SEO fields
- **documents**: File uploads with categories
- **calculators**: Dynamic calculator definitions
- **calculator_rates**: Calculator rate management
- **settings**: System configuration storage
- **contact_messages**: Contact form submissions
- **course_applications**: Course application data

## ✨ Features

### 🏠 Public Website
- Homepage with hero section and services
- About page with company information
- Services page with detailed offerings
- Contact form with validation

### 📝 Blog System
- Rich text editor (TinyMCE)
- SEO optimization with meta tags
- Image upload and management
- Categories and tags
- Publishing control

### 📄 Document Archive
- File upload (PDF, DOC, XLS)
- Category organization
- Public/private access control
- Download tracking
- Search and filter capabilities

### 🧮 Dynamic Calculators
- Admin-configurable calculators
- Multiple calculator types
- Rate management system
- SEO-friendly URLs
- Mobile-responsive design

### 👥 User Management
- Role-based access (Admin/User)
- Profile management
- Secure authentication
- Password security

### ⚙️ System Settings
- Site configuration
- Maintenance mode
- Email settings
- Backup configuration
- Database persistence

## 🧩 Components Guide

### Admin Components (`src/components/admin/`)
- **UserManagement**: User CRUD operations
- **DocumentUpload**: File upload interface
- **SystemSettings**: Configuration management
- **CalculatorsManagement**: Calculator management

### Blog Components (`src/components/blog/`)
- **ModernRichTextEditor**: TinyMCE integration
- **ImageUpload**: Blog image management
- **SEOSettings**: SEO metadata management
- **TagsInput**: Tag management

### UI Components (`src/components/ui/`)
- Shadcn/ui component library
- Custom styled components
- Responsive design patterns

## 🔄 Development Workflow

### Adding New Features

1. **Backend**: Create controller, model, migration
```bash
php artisan make:controller Api/FeatureController
php artisan make:model Feature -m
```

2. **Frontend**: Add API method, create component
```typescript
// Add to src/integrations/laravel/client.ts
async getFeatures() {
  return await this.request('/features');
}
```

3. **Testing**: Write tests for both frontend and backend

### Code Style
- Follow TypeScript/React best practices
- Use PSR-12 for PHP code
- TailwindCSS for styling
- ESLint/Prettier for formatting

## 📱 Deployment

### Production Setup

1. **Backend**:
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

2. **Frontend**:
```bash
npm run build
# Deploy dist/ folder to web server
```

3. **Environment**:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

## 🛡️ Security

### Implemented Security Features
- Laravel Sanctum authentication
- JWT token management
- Input validation and sanitization
- XSS protection
- CSRF protection
- File upload security
- Role-based access control

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `SANCTUM_STATEFUL_DOMAINS` in `.env`
2. **File Upload Issues**: Verify storage permissions and links
3. **Database Issues**: Check SQLite file exists and permissions
4. **Auth Issues**: Clear cache and verify Sanctum config

### Debug Commands
```bash
# Laravel
php artisan cache:clear
php artisan config:clear
tail -f storage/logs/laravel.log

# Frontend
npm run build -- --force
# Check browser console for errors
```

## 📞 Quick Reference

### Backend Commands
```bash
php artisan serve              # Start server
php artisan migrate           # Run migrations
php artisan tinker           # Interactive shell
php artisan cache:clear      # Clear cache
php artisan storage:link     # Create storage link
```

### Frontend Commands
```bash
npm run dev                  # Development server
npm run build               # Production build
npm run preview             # Preview build
npm run lint               # Run linter
```

---

## 🎯 Getting Started Checklist

- [ ] Install Node.js and PHP
- [ ] Clone repository
- [ ] Setup backend (composer, .env, migrate)
- [ ] Setup frontend (npm install)
- [ ] Create admin user
- [ ] Test both frontend and backend
- [ ] Read through this README
- [ ] Start developing!

**Happy Coding! 🚀**

---

*For additional help or questions, please refer to the troubleshooting section or contact the development team.*
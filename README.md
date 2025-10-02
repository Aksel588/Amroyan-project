# 🌐 Amroyan Consulting - Professional Business Platform

<div align="center">

![Amroyan Consulting](https://img.shields.io/badge/Amroyan-Consulting-blue?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A comprehensive business consulting platform with advanced calculators, document management, and multi-language support**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Aksel588/Amroyan-project/graphs/commit-activity)

</div>

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation & Setup](#-installation--setup)
- [🌐 API Documentation](#-api-documentation)
- [🔐 Authentication](#-authentication)
- [📊 Database Schema](#-database-schema)
- [✨ Features](#-features)
- [🧮 Calculator System](#-calculator-system)
- [📄 Document Management](#-document-management)
- [🧩 Components Guide](#-components-guide)
- [🌍 Internationalization](#-internationalization)
- [🔄 Development Workflow](#-development-workflow)
- [📱 Deployment](#-deployment)
- [🛡️ Security](#️-security)
- [📈 Performance](#-performance)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)

## 🎯 Project Overview

**Amroyan Consulting** is a comprehensive business platform designed for professional consulting services, featuring advanced financial calculators, document management, and multi-language support. The platform serves both public users seeking consulting services and administrators managing the business operations.

### 🎯 Core Objectives

- **Business Automation**: Streamline consulting workflows with automated calculators
- **Client Management**: Provide tools for managing client relationships and documents
- **Knowledge Sharing**: Blog system for sharing industry insights and updates
- **Multi-language Support**: Serve Armenian-speaking clients with native language support
- **Professional Presentation**: Modern, responsive design showcasing expertise

### 🌟 Key Capabilities

- **Advanced Financial Calculators**: Armenian tax, payroll, project estimation, and turnover tax calculators
- **Document Archive**: Comprehensive document management with categorization and access control
- **Content Management**: Full-featured blog with SEO optimization and rich text editing
- **User Authentication**: Secure role-based access control (Admin/User)
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **API-First Architecture**: RESTful API for extensibility and integration

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Public    │  │    Admin    │  │ Calculators │  │  Blog   │ │
│  │   Pages     │  │  Dashboard  │  │   System    │  │ System  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    API Layer (Laravel)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Auth      │  │   Content   │  │  Document    │  │  Calc   │ │
│  │ Controller  │  │ Controller  │  │ Controller   │  │Controller│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Database Layer (SQLite)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │    Users    │  │ Blog Posts   │  │ Documents    │  │Settings │ │
│  │   Table     │  │   Table      │  │   Table      │  │ Table   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend Components
├── Public Components
│   ├── Header & Navigation
│   ├── Footer
│   ├── Home Page
│   ├── About & Services
│   └── Contact Forms
├── Calculator Components
│   ├── Armenian Tax Calculator
│   ├── Project Calculator
│   ├── Payroll Calculator
│   └── Turnover Tax Calculator
├── Admin Components
│   ├── User Management
│   ├── Document Upload
│   ├── Blog Editor
│   └── System Settings
└── Shared Components
    ├── UI Components (Shadcn/ui)
    ├── Authentication
    └── Language Context
```

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Modern UI framework with hooks and functional components |
| **TypeScript** | 5.5.3 | Type-safe JavaScript for better development experience |
| **TailwindCSS** | 3.4.11 | Utility-first CSS framework for rapid styling |
| **Shadcn/ui** | Latest | Modern, accessible component library |
| **Vite** | 5.4.1 | Fast build tool and development server |
| **React Router** | 6.26.2 | Client-side routing and navigation |
| **TanStack Query** | 5.56.2 | Powerful data fetching and caching |
| **React Hook Form** | 7.53.0 | Performant forms with easy validation |
| **Zod** | 3.23.8 | TypeScript-first schema validation |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 12.0 | Modern PHP framework with elegant syntax |
| **PHP** | 8.2+ | Server-side programming language |
| **SQLite** | Latest | Lightweight, serverless database |
| **Laravel Sanctum** | 4.2 | API authentication and token management |
| **Eloquent ORM** | Built-in | Active record ORM for database operations |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and style enforcement |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing and optimization |
| **Autoprefixer** | Automatic vendor prefixing |
| **Lovable Tagger** | Development workflow enhancement |

### Key Libraries & Integrations

- **@tiptap/react**: Rich text editor for blog content
- **@supabase/supabase-js**: Database and authentication services
- **Lucide React**: Beautiful icon library
- **Date-fns**: Modern date utility library
- **Recharts**: Composable charting library
- **Sonner**: Toast notification system

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

## 🧮 Calculator System

The platform features a comprehensive suite of financial calculators designed specifically for Armenian business needs:

### 📊 Available Calculators

#### 1. **Armenian Tax Calculator** 
- **Purpose**: Complete Armenian tax calculation with 79 calculation rows
- **Features**: 
  - Income calculations (domestic & foreign)
  - Expense tracking and deductions
  - Loss calculations
  - Tax reductions and exemptions
  - Final profit tax calculation (18%)
- **Use Case**: Annual tax planning and compliance

#### 2. **Project Calculator**
- **Purpose**: Project cost estimation with salary calculations
- **Features**:
  - Up to 6 salary positions (hourly, daily, monthly)
  - Tax calculations (income tax, pension contributions)
  - Profit margin calculations
  - VAT inclusion (20%)
  - Detailed cost breakdown
- **Use Case**: Project bidding and cost estimation

#### 3. **Armenian Payroll Calculator**
- **Purpose**: Comprehensive salary and payroll calculations
- **Features**:
  - Multiple salary types
  - Tax deductions
  - Social security contributions
  - Net/gross salary calculations
- **Use Case**: Monthly payroll processing

#### 4. **Turnover Tax Calculator**
- **Purpose**: Quarterly turnover tax calculations
- **Features**:
  - Multiple business activity types
  - Fixed and calculated tax rates
  - Minimum tax calculations
  - Cost deduction handling
- **Use Case**: Quarterly tax compliance

#### 5. **Comprehensive Salary Calculator**
- **Purpose**: Advanced salary calculations with benefits
- **Features**:
  - Multiple benefit types
  - Tax optimization
  - Detailed reporting
- **Use Case**: HR planning and compensation analysis

### 🔧 Calculator Features

- **Real-time Calculations**: Instant updates as users input data
- **Armenian Currency Formatting**: Proper AMD formatting throughout
- **Mobile Responsive**: Optimized for all device sizes
- **Save & Export**: Ability to save calculations and export results
- **Admin Configuration**: Dynamic rate management through admin panel
- **SEO Optimized**: Each calculator has dedicated SEO-friendly URLs

- **SEO Optimized**: Each calculator has dedicated SEO-friendly URLs

## 📄 Document Management

The platform includes a comprehensive document management system for organizing and sharing business documents:

### 📁 Document Features

- **File Upload Support**: PDF, DOC, XLS, and other business document formats
- **Category Organization**: Structured categorization for easy navigation
- **Access Control**: Public/private document visibility settings
- **Download Tracking**: Monitor document access and downloads
- **Search & Filter**: Advanced search capabilities across all documents
- **Version Control**: Track document updates and changes
- **Metadata Management**: Rich metadata for each document

### 🗂️ Document Categories

- **Standards**: Industry standards and regulations
- **Notifications**: Official notifications and updates
- **Clarifications**: Tax law and labor law clarifications
- **Discussions**: Professional discussions and insights
- **Tests**: Accounting and HR test materials
- **General**: Miscellaneous business documents

### 📊 Document Statistics

- View count tracking
- Download analytics
- Popular documents identification
- User engagement metrics

## 🌍 Internationalization

The platform supports multiple languages with a focus on Armenian language integration:

### 🌐 Language Support

- **Armenian (Primary)**: Full Armenian language support throughout the platform
- **English (Secondary)**: Complete English translation for international users
- **Dynamic Language Switching**: Real-time language switching without page reload
- **Context-Aware Translations**: Smart translation system that adapts to context

### 🔧 Translation Features

- **Comprehensive Coverage**: All UI elements, content, and messages translated
- **Cultural Adaptation**: Armenian-specific formatting for dates, numbers, and currency
- **SEO Optimization**: Language-specific URLs and meta tags
- **Admin Translation Tools**: Easy translation management through admin panel

### 📝 Content Localization

- **Blog Posts**: Multi-language blog content support
- **Document Metadata**: Translated document descriptions and categories
- **Calculator Labels**: Localized calculator field names and descriptions
- **Error Messages**: User-friendly error messages in both languages

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
- **Laravel Sanctum Authentication**: Secure API token-based authentication
- **JWT Token Management**: Stateless authentication with token refresh
- **Input Validation & Sanitization**: Comprehensive input validation using Zod schemas
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection
- **File Upload Security**: Secure file handling with type validation
- **Role-based Access Control**: Granular permission system
- **SQL Injection Prevention**: Parameterized queries through Eloquent ORM
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Headers**: Security headers implementation

### Security Best Practices
- Environment variable management for sensitive data
- Secure password hashing with bcrypt
- HTTPS enforcement in production
- Regular security updates and dependency management
- Input sanitization and validation on both frontend and backend

## 📈 Performance

### Frontend Performance Optimizations
- **Code Splitting**: Dynamic imports for route-based code splitting
- **Lazy Loading**: Component lazy loading for better initial load times
- **Image Optimization**: Optimized images with proper formats and sizing
- **Caching Strategy**: React Query for intelligent data caching
- **Bundle Optimization**: Vite's optimized build process
- **Tree Shaking**: Dead code elimination in production builds

### Backend Performance Features
- **Database Optimization**: Efficient queries with Eloquent ORM
- **Caching**: Laravel's built-in caching mechanisms
- **API Response Optimization**: Minimal data transfer with selective field loading
- **File Storage Optimization**: Efficient file handling and storage
- **Database Indexing**: Proper indexing for fast queries

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

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

## 🤝 Contributing

We welcome contributions to the Amroyan Consulting platform! Here's how you can help:

### 🚀 Getting Started

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Clone Your Fork**: `git clone https://github.com/yourusername/Amroyan-project.git`
3. **Create a Branch**: `git checkout -b feature/your-feature-name`
4. **Make Changes**: Implement your feature or bug fix
5. **Test Your Changes**: Ensure all tests pass and functionality works
6. **Commit Changes**: `git commit -m "Add your feature"`
7. **Push to Branch**: `git push origin feature/your-feature-name`
8. **Create Pull Request**: Submit a PR with a clear description

### 📝 Contribution Guidelines

- **Code Style**: Follow existing code patterns and ESLint rules
- **Documentation**: Update documentation for new features
- **Testing**: Add tests for new functionality
- **Commit Messages**: Use clear, descriptive commit messages
- **Pull Requests**: Provide detailed descriptions of changes

### 🐛 Reporting Issues

When reporting issues, please include:
- **Environment**: OS, Node.js version, PHP version
- **Steps to Reproduce**: Clear steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable, include screenshots
- **Error Logs**: Include relevant error messages

### 💡 Feature Requests

For feature requests, please:
- **Check Existing Issues**: Ensure the feature isn't already requested
- **Provide Context**: Explain why the feature would be valuable
- **Describe Use Case**: How would you use this feature?
- **Mockups**: If applicable, include design mockups

## 📞 Support

### 🆘 Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Search existing GitHub issues for solutions
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team directly

### 📧 Contact Information

- **Project Maintainer**: Aksel588
- **GitHub Repository**: [https://github.com/Aksel588/Amroyan-project](https://github.com/Aksel588/Amroyan-project)
- **Issues**: [GitHub Issues](https://github.com/Aksel588/Amroyan-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aksel588/Amroyan-project/discussions)

### 🏢 Business Inquiries

For business-related inquiries about Amroyan Consulting services:
- **Website**: Visit the live platform for contact information
- **Services**: Explore the services page for available offerings
- **Calculators**: Use the financial calculators for business planning

---

## 🙏 Acknowledgments

- **Laravel Community**: For the excellent PHP framework
- **React Team**: For the powerful UI library
- **Shadcn/ui**: For the beautiful component library
- **TailwindCSS**: For the utility-first CSS framework
- **Vite Team**: For the fast build tool
- **All Contributors**: Thank you for your contributions!

---

<div align="center">

**Built with ❤️ for the Armenian business community**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Powered by Laravel](https://img.shields.io/badge/Powered%20by-Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

**Created by Global IT Company**

</div>

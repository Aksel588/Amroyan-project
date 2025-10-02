# 🌐 Amroyan Consulting - API Documentation

## 📋 Overview

This document provides comprehensive API documentation for the Amroyan Consulting platform. The API is built with Laravel 12 and follows RESTful conventions.

## 🔗 Base URL

```
Development: http://127.0.0.1:8000/api
Production: https://yourdomain.com/api
```

## 🔐 Authentication

The API uses Laravel Sanctum for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer {your-token}
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin",
    "email_verified_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "1|abcdef123456..."
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

## 📝 Blog Management

### Get All Blog Posts
```http
GET /api/blog-posts
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `search`: Search term
- `category`: Filter by category
- `published`: Filter by published status (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Short description...",
      "content": "Full content...",
      "featured_image_url": "https://example.com/image.jpg",
      "meta_title": "SEO Title",
      "meta_description": "SEO Description",
      "tags": ["tag1", "tag2"],
      "published": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 25
  }
}
```

### Get Single Blog Post
```http
GET /api/blog-posts/{id}
```

### Create Blog Post (Admin Only)
```http
POST /api/blog-posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Blog Post",
  "content": "Blog content...",
  "excerpt": "Short description",
  "featured_image_url": "https://example.com/image.jpg",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "tags": ["tag1", "tag2"],
  "published": true
}
```

### Update Blog Post (Admin Only)
```http
PUT /api/blog-posts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Delete Blog Post (Admin Only)
```http
DELETE /api/blog-posts/{id}
Authorization: Bearer {token}
```

## 📄 Document Management

### Get All Documents
```http
GET /api/documents
```

**Query Parameters:**
- `category`: Filter by category
- `published`: Filter by published status
- `search`: Search term

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Document Title",
      "description": "Document description",
      "file_name": "document.pdf",
      "file_path": "documents/document.pdf",
      "file_size": 1024000,
      "category": "standards",
      "published": true,
      "view_count": 150,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

### Upload Document (Admin Only)
```http
POST /api/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Document Title",
  "description": "Document description",
  "file": [file],
  "category": "standards",
  "published": true
}
```

### Update Document (Admin Only)
```http
PUT /api/documents/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "published": false
}
```

### Delete Document (Admin Only)
```http
DELETE /api/documents/{id}
Authorization: Bearer {token}
```

### Toggle Document Publish Status (Admin Only)
```http
POST /api/documents/{id}/toggle-publish
Authorization: Bearer {token}
```

## 🧮 Calculator Management

### Get All Calculators
```http
GET /api/calculators
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Armenian Tax Calculator",
      "slug": "armenian-tax",
      "description": "Complete Armenian tax calculation",
      "active": true,
      "rates": [
        {
          "id": 1,
          "name": "Income Tax Rate",
          "value": 20,
          "type": "percentage"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

### Create Calculator (Admin Only)
```http
POST /api/calculators
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Calculator",
  "slug": "new-calculator",
  "description": "Calculator description",
  "active": true
}
```

### Update Calculator (Admin Only)
```http
PUT /api/calculators/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Calculator",
  "active": false
}
```

### Delete Calculator (Admin Only)
```http
DELETE /api/calculators/{id}
Authorization: Bearer {token}
```

## ⚙️ Settings Management

### Get All Settings
```http
GET /api/settings
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "key": "site_name",
      "value": "Amroyan Consulting",
      "type": "string",
      "description": "Website name"
    },
    {
      "id": 2,
      "key": "maintenance_mode",
      "value": "false",
      "type": "boolean",
      "description": "Maintenance mode status"
    }
  ]
}
```

### Update Settings (Admin Only)
```http
PUT /api/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "settings": [
    {
      "key": "site_name",
      "value": "Updated Site Name"
    },
    {
      "key": "maintenance_mode",
      "value": "true"
    }
  ]
}
```

### Initialize Default Settings (Admin Only)
```http
POST /api/settings/initialize
Authorization: Bearer {token}
```

## 📊 Statistics

### Get Platform Statistics (Admin Only)
```http
GET /api/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "total_users": 150,
    "total_blog_posts": 25,
    "total_documents": 100,
    "total_calculators": 5,
    "recent_blog_posts": 5,
    "recent_documents": 10,
    "recent_users": 3
  }
}
```

## 📞 Contact Management

### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+37412345678",
  "subject": "Inquiry",
  "message": "Contact message..."
}
```

### Get Contact Messages (Admin Only)
```http
GET /api/contact-messages
Authorization: Bearer {token}
```

### Delete Contact Message (Admin Only)
```http
DELETE /api/contact-messages/{id}
Authorization: Bearer {token}
```

## 📧 Newsletter Management

### Subscribe to Newsletter
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

### Get Newsletter Subscribers (Admin Only)
```http
GET /api/newsletter/subscribers
Authorization: Bearer {token}
```

### Unsubscribe from Newsletter
```http
POST /api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

## 👥 User Management (Admin Only)

### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password",
  "role": "user"
}
```

### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "updated@example.com",
  "role": "admin"
}
```

### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

## 📋 Course Applications

### Submit Course Application
```http
POST /api/course-applications
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+37412345678",
  "email": "john@example.com",
  "course_type": "accounting",
  "message": "Application message..."
}
```

### Get Course Applications (Admin Only)
```http
GET /api/course-applications
Authorization: Bearer {token}
```

### Update Course Application (Admin Only)
```http
PUT /api/course-applications/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "notes": "Application approved"
}
```

## 🔧 Error Handling

### Error Response Format
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## 📝 Rate Limiting

The API implements rate limiting to prevent abuse:
- **General API**: 60 requests per minute
- **Authentication**: 5 requests per minute
- **File Upload**: 10 requests per minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## 🔒 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)
- `http://localhost:8080` (Alternative dev server)
- `http://localhost:8081` (Alternative dev server)
- `http://127.0.0.1:5173` (Vite dev server)
- `http://127.0.0.1:3000` (Alternative dev server)
- `http://127.0.0.1:8080` (Alternative dev server)
- `http://127.0.0.1:8081` (Alternative dev server)

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel API Resources](https://laravel.com/docs/eloquent-resources)
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

*For more information, please refer to the main README.md file or contact the development team.*

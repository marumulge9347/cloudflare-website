# Cloudflare Website Automation

A full-stack content management and AI automation platform built with Node.js, Express, MongoDB, React, Vite, and Cloudflare services.

## Current Features

- Admin authentication
- JWT authentication
- HttpOnly authentication cookies
- MongoDB Atlas integration
- Category management
- Tag management
- Post management
- Automatic post slug generation
- Draft / published / archived status
- SEO metadata
- Post search
- Post pagination
- Category and tag relationships
- Author relationships

## Project Structure

```text
Cloudflare-website/
│
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   │
│   └── web/
│
├── .gitignore
├── package.json
└── README.md
```

# Cloudflare Website Automation

A full-stack content management and AI automation platform built with **Node.js, Express, MongoDB, React, Vite, and Cloudflare services**.

The project is being developed as a production-style blogging platform with an admin CMS, public blog, AI-assisted content generation, SEO automation, media storage, and scheduled publishing.

---

## Project Status

### Completed

- [x] Project foundation
- [x] Node.js + Express API
- [x] MongoDB Atlas connection
- [x] Admin user system
- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] HttpOnly authentication cookies
- [x] Protected admin routes
- [x] Category CRUD
- [x] Tag CRUD
- [x] Post CRUD
- [x] Automatic slug generation
- [x] Unique post slugs
- [x] Draft / Published / Archived status
- [x] Category relationships
- [x] Tag relationships
- [x] Author relationships
- [x] SEO metadata
- [x] Post search
- [x] Pagination
- [x] Public blog API
- [x] Public published-post filtering
- [x] Public post-by-slug API
- [x] Public categories API
- [x] Public tags API
- [x] Public latest/featured posts API
- [x] Public post view counter
- [x] GitHub repository integration

### Planned

- [x] React + Vite frontend
- [x] Admin dashboard
- [ ] Article editor
- [ ] Category management UI
- [ ] Tag management UI
- [ ] Public blog UI
- [ ] AI Writer
- [ ] OpenRouter integration
- [ ] SEO automation
- [ ] Cloudflare R2 media storage
- [ ] Image upload system
- [ ] Scheduled publishing
- [ ] Background jobs
- [ ] Automation workflows
- [ ] Audit logs
- [ ] API testing
- [ ] Production deployment
- [ ] Cloudflare Workers integration

---

# Architecture

```text
                         Cloudflare Website
                                |
                 +--------------+--------------+
                 |                             |
            Public Website                Admin Studio
                 |                             |
                 +--------------+--------------+
                                |
                           Express API
                                |
             +------------------+------------------+
             |                  |                  |
          Public API        Admin API          Auth API
             |                  |                  |
       /api/public/*       /api/posts/*       /api/auth/*
                            /api/categories
                            /api/tags
             |                  |
             +--------+---------+
                      |
                   MongoDB
                      |
          +-----------+-----------+
          |           |           |
        Users      Posts      Categories
                      |
                    Tags
```

---

# Technology Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Tokens
- cookie-parser
- CORS
- dotenv

## Frontend

Planned:

- React
- Vite
- Tailwind CSS

## Cloudflare

Planned:

- Cloudflare Workers
- Cloudflare R2
- Cloudflare Pages / deployment
- Cloudflare CDN
- Cloudflare caching
- Cloudflare automation

## AI

Planned:

- OpenRouter
- Free/low-cost AI models
- AI article generation
- SEO optimization
- Content improvement
- Automated workflows

---

# Project Structure

```text
Cloudflare-website/
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
│
└── apps/
    │
    ├── api/
    │   │
    │   ├── .env
    │   ├── .env.example
    │   ├── package.json
    │   ├── package-lock.json
    │   │
    │   └── src/
    │       │
    │       ├── config/
    │       │   ├── database.js
    │       │   └── env.js
    │       │
    │       ├── controllers/
    │       │   ├── authController.js
    │       │   ├── categoryController.js
    │       │   ├── healthController.js
    │       │   ├── postController.js
    │       │   ├── publicController.js
    │       │   └── tagController.js
    │       │
    │       ├── middleware/
    │       │   ├── authMiddleware.js
    │       │   └── errorHandler.js
    │       │
    │       ├── models/
    │       │   ├── Category.js
    │       │   ├── Post.js
    │       │   ├── Tag.js
    │       │   └── User.js
    │       │
    │       ├── routes/
    │       │   ├── adminRoutes.js
    │       │   ├── authRoutes.js
    │       │   ├── categoryRoutes.js
    │       │   ├── healthRoutes.js
    │       │   ├── postRoutes.js
    │       │   ├── publicRoutes.js
    │       │   └── tagRoutes.js
    │       │
    │       ├── services/
    │       │   └── authService.js
    │       │
    │       ├── utils/
    │       │   ├── pagination.js
    │       │   └── slugify.js
    │       │
    │       ├── createAdmin.js
    │       └── index.js
    │
    └── web/
        │
        └── React application
```

---

# Environment Variables

Create:

```text
apps/api/.env
```

Use:

```text
apps/api/.env.example
```

as the template.

Example:

```env
PORT=5000

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ai_blog?retryWrites=true&w=majority

CLIENT_URL=http://localhost:5173

NODE_ENV=development

JWT_SECRET=YOUR_LONG_RANDOM_SECRET

JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@example.com

ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD

OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
```

### Security

Never commit:

```text
.env
cookies.txt
node_modules/
```

Only the following should be committed:

```text
.env.example
```

---

# Installation

From the project root:

```bash
npm install
```

Install backend dependencies:

```bash
npm --prefix apps/api install
```

When the frontend is added:

```bash
npm --prefix apps/web install
```

---

# Running the Backend

Start the API:

```bash
npm --prefix apps/api run dev
```

Expected:

```text
MongoDB connected
API running on http://localhost:5000
```

---

# Health Check

Test:

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{
  "success": true,
  "api": "ok",
  "database": "connected",
  "environment": "development"
}
```

---

# Authentication

## Create Admin

Configure:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YOUR_PASSWORD
```

Then:

```bash
npm --prefix apps/api run create-admin
```

---

## Login

```bash
curl -i -c cookies.txt \
-H "Content-Type: application/json" \
-d '{"email":"admin@example.com","password":"YOUR_PASSWORD"}' \
http://localhost:5000/api/auth/login
```

Successful authentication creates an HttpOnly cookie:

```text
access_token
```

---

## Test Protected Route

```bash
curl -i -b cookies.txt \
http://localhost:5000/api/admin/dashboard
```

---

# CMS API

All CMS management endpoints require admin authentication.

## Categories

### Create

```text
POST /api/categories
```

Example:

```json
{
  "name": "Cloudflare",
  "description": "Cloudflare tutorials and automation"
}
```

### List

```text
GET /api/categories
```

### Get One

```text
GET /api/categories/:id
```

### Update

```text
PUT /api/categories/:id
```

### Delete

```text
DELETE /api/categories/:id
```

---

# Tags

### Create

```text
POST /api/tags
```

Example:

```json
{
  "name": "Workers",
  "description": "Cloudflare Workers"
}
```

### List

```text
GET /api/tags
```

### Get One

```text
GET /api/tags/:id
```

### Update

```text
PUT /api/tags/:id
```

### Delete

```text
DELETE /api/tags/:id
```

---

# Posts

## Create

```text
POST /api/posts
```

Example:

```json
{
  "title": "Getting Started With Cloudflare Workers",
  "excerpt": "A beginner-friendly introduction to Cloudflare Workers.",
  "content": "Cloudflare Workers allow developers to run server-side code at the edge.",
  "status": "draft",
  "category": "CATEGORY_ID",
  "tags": ["TAG_ID"],
  "seo": {
    "metaTitle": "Getting Started With Cloudflare Workers",
    "metaDescription": "Learn the basics of Cloudflare Workers.",
    "keywords": ["Cloudflare", "Workers", "Serverless"],
    "canonicalUrl": ""
  }
}
```

---

## List Posts

```text
GET /api/posts
```

Supports:

```text
?page=1
?limit=10
?search=cloudflare
?status=draft
?status=published
?status=archived
?category=CATEGORY_ID
?tag=TAG_ID
```

Example:

```text
GET /api/posts?page=1&limit=10&status=published
```

---

## Get Post

```text
GET /api/posts/:id
```

---

## Update Post

```text
PUT /api/posts/:id
```

---

## Delete Post

```text
DELETE /api/posts/:id
```

---

# Post Workflow

Posts support three states:

```text
draft
published
archived
```

Workflow:

```text
             +-----------+
             |   Draft   |
             +-----+-----+
                   |
                   | Publish
                   v
             +-----------+
             | Published |
             +-----+-----+
                   |
                   | Archive
                   v
             +-----------+
             | Archived  |
             +-----------+
```

Only published posts are available through the public blog API.

---

# Public Blog API

Public endpoints do **not** require authentication.

## Public Posts

```text
GET /api/public/posts
```

Returns only:

```text
status = published
```

---

## Public Search

```text
GET /api/public/posts?search=Workers
```

---

## Public Pagination

```text
GET /api/public/posts?page=1&limit=10
```

---

## Public Category Filtering

```text
GET /api/public/posts?category=cloudflare
```

Categories are selected using their slug.

---

## Public Tag Filtering

```text
GET /api/public/posts?tag=workers
```

Tags are selected using their slug.

---

## Public Article

```text
GET /api/public/posts/:slug
```

Example:

```text
GET /api/public/posts/getting-started-with-cloudflare-workers
```

The endpoint returns:

- title
- slug
- excerpt
- content
- featured image
- category
- tags
- author
- published date
- view count
- SEO metadata

---

# Public View Counter

Opening a published article increments its view count.

Example:

```text
First request  → views: 1
Second request → views: 2
Third request  → views: 3
```

---

# Public Categories

```text
GET /api/public/categories
```

Only active categories are returned.

---

# Public Tags

```text
GET /api/public/tags
```

Only active tags are returned.

---

# Latest / Featured Posts

```text
GET /api/public/featured
```

Optional:

```text
GET /api/public/featured?limit=3
```

---

# Data Model

## User

```text
User
├── name
├── email
├── passwordHash
├── role
├── active
├── createdAt
└── updatedAt
```

## Category

```text
Category
├── name
├── slug
├── description
├── active
├── createdAt
└── updatedAt
```

## Tag

```text
Tag
├── name
├── slug
├── description
├── active
├── createdAt
└── updatedAt
```

## Post

```text
Post
├── title
├── slug
├── excerpt
├── content
├── featuredImage
├── status
├── category
├── tags
├── author
├── seo
├── publishedAt
├── views
├── createdAt
└── updatedAt
```

---

# Security Architecture

The project uses:

```text
Password
   ↓
bcrypt
   ↓
Password Hash
   ↓
MongoDB
```

Authentication:

```text
Login
  ↓
Verify password
  ↓
Create JWT
  ↓
HttpOnly Cookie
  ↓
Browser
```

Protected request:

```text
Browser
  ↓
Cookie
  ↓
JWT verification
  ↓
Authentication middleware
  ↓
Admin route
  ↓
Controller
  ↓
MongoDB
```

Public request:

```text
Visitor
  ↓
Public API
  ↓
Published filter
  ↓
MongoDB
  ↓
Published content
```

---

# Git Workflow

Check status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Review staged files:

```bash
git diff --cached --name-only
```

Commit:

```bash
git commit -m "Your commit message"
```

Push:

```bash
git push
```

Check synchronization:

```bash
git pull --rebase origin main
```

---

# Development Milestones

## Milestone 1 — Backend Foundation

- Express server
- MongoDB
- Environment configuration
- Health endpoint

## Milestone 2 — Authentication

- User model
- bcrypt
- JWT
- HttpOnly cookies
- Admin middleware

## Milestone 3 — CMS

- Categories
- Tags
- Posts
- Slugs
- Search
- Pagination
- SEO
- Publishing workflow

## Milestone 4 — Public Blog API

- Published posts
- Post slug API
- Categories
- Tags
- Search
- Filtering
- View counter

## Milestone 5 — Frontend

- React
- Vite
- Tailwind CSS
- Login
- Dashboard
- Posts
- Editor
- Categories
- Tags
- Public blog

## Milestone 6 — AI

- OpenRouter
- AI article generation
- SEO generation
- Content improvement
- AI-assisted editing

## Milestone 7 — Cloudflare

- R2 media storage
- Workers
- CDN
- Caching
- Scheduled jobs
- Automated publishing

## Milestone 8 — Production

- Testing
- Security hardening
- Monitoring
- Error handling
- Deployment
- Documentation

---

# Current Git Commit

Current completed backend milestone:

```text
Build CMS backend with authentication and CRUD
```

Public Blog API is the next development milestone.

---

# Project Goal

The final system will provide:

```text
                    Cloudflare Website
                           |
          +----------------+----------------+
          |                                 |
      Public Blog                       Admin CMS
          |                                 |
          |                           Content Management
          |                                 |
          |                           AI Writer
          |                                 |
          |                           SEO Automation
          |                                 |
          +---------------+-----------------+
                          |
                    Automation Layer
                          |
             +------------+------------+
             |            |            |
          OpenRouter    Cloudflare    Scheduler
             |             |            |
             |            R2        Background Jobs
             |             |
             +-------------+
                    |
                 MongoDB
```

The objective is to build a complete, scalable blogging and automation platform that demonstrates practical full-stack development, API design, authentication, database relationships, AI integration, SEO automation, and Cloudflare infrastructure.

Cloudflare Website --- CMS + Public Blog

A full-stack Cloudflare-focused blogging platform being built as a
learning project and portfolio project.

The project is designed to demonstrate:

Full-stack JavaScript development

REST API design

Authentication and authorization

MongoDB data modeling

Admin CMS workflows

Public blog rendering

SEO-ready article management

AI-assisted article writing

Automation workflows

Git/GitHub development practices

Cloudflare deployment and edge concepts

1. Current Project Status

Completed

Repository initialized and connected to GitHub

Node.js project structure

Express API

MongoDB configuration

Environment configuration

User model

Admin user creation

Login/logout authentication

JWT authentication using an HTTP-only cookie

Admin authorization middleware

Admin dashboard API

Category backend CRUD

Tag backend CRUD

Post backend CRUD

Post slug generation

SEO fields in posts

Public blog API

React frontend

Login page

Admin dashboard page

Posts management page

Article editor

Public blog page

Public article page

Categories management UI

Tags management UI

Protected admin routes

Git rebase/conflict resolution

Changes pushed to GitHub

In progress

Verify all admin CRUD flows from the browser

Finish/verify public blog UI

Improve admin navigation/layout

Add stronger validation and error handling

Add AI Writer using OpenRouter

Add automation layer

Add testing

Prepare production deployment

Deploy using Cloudflare services

2.  Architecture

                         Cloudflare Website
                                |
              +-----------------+-----------------+
              |                                   |
          React Web App                       Express API
              |                                   |
              |                              Authentication
              |                                   |
              |                              Controllers
              |                                   |
              |                                Services
              |                                   |
              |                                 Models
              |                                   |
              +------------------------------- MongoDB

Future:

React
|
Express API
|
OpenRouter AI
|
Automation Layer
|
Cloudflare Services
|
Production Deployment

3. Repository Structure

Cloudflare-website/
│
├── apps/
│ │
│ ├── api/
│ │ ├── src/
│ │ │ ├── config/
│ │ │ │ ├── database.js
│ │ │ │ └── env.js
│ │ │ │
│ │ │ ├── controllers/
│ │ │ │ ├── authController.js
│ │ │ │ ├── categoryController.js
│ │ │ │ ├── healthController.js
│ │ │ │ ├── postController.js
│ │ │ │ └── tagController.js
│ │ │ │
│ │ │ ├── middleware/
│ │ │ │ ├── authMiddleware.js
│ │ │ │ └── errorHandler.js
│ │ │ │
│ │ │ ├── models/
│ │ │ │ ├── Category.js
│ │ │ │ ├── Post.js
│ │ │ │ ├── Tag.js
│ │ │ │ └── User.js
│ │ │ │
│ │ │ ├── routes/
│ │ │ │ ├── adminRoutes.js
│ │ │ │ ├── authRoutes.js
│ │ │ │ ├── categoryRoutes.js
│ │ │ │ ├── healthRoutes.js
│ │ │ │ ├── postRoutes.js
│ │ │ │ └── tagRoutes.js
│ │ │ │
│ │ │ ├── services/
│ │ │ │ └── authService.js
│ │ │ │
│ │ │ ├── utils/
│ │ │ │ ├── pagination.js
│ │ │ │ └── slugify.js
│ │ │ │
│ │ │ ├── createAdmin.js
│ │ │ └── index.js
│ │ │
│ │ ├── .env.example
│ │ ├── package.json
│ │ └── package-lock.json
│ │
│ └── web/
│ └── src/
│ ├── lib/
│ │ └── api.js
│ │
│ ├── pages/
│ │ ├── ArticleEditor.jsx
│ │ ├── Categories.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Login.jsx
│ │ ├── Posts.jsx
│ │ ├── PublicArticle.jsx
│ │ ├── PublicBlog.jsx
│ │ └── Tags.jsx
│ │
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

4. Backend

The API is built with Node.js and Express.

Main responsibilities

The backend handles:

Authentication

Authorization

Users

Categories

Tags

Posts

SEO data

Public blog data

Database access

API error handling

5. Authentication

Authentication uses:

Email + Password
|
v
POST /api/auth/login
|
v
JWT generated
|
v
HTTP-only access_token cookie
|
v
Browser sends cookie automatically

The cookie is configured with:

HttpOnly

SameSite=Lax

Access token expiration

The browser therefore does not need to store the JWT in localStorage.

Current authentication flow

Login.jsx
|
v
login(email, password)
|
v
POST /api/auth/login
|
v
Express
|
v
Auth Controller
|
v
JWT
|
v
access_token cookie

The current admin authentication was successfully tested with:

curl -i -c cookies.txt \
-H "Content-Type: application/json" \
-d '{"email":"admin@example.com","password":"..."}' \
http://localhost:5000/api/auth/login

The response returned HTTP 200 and an authenticated admin user.

6. Authorization

Admin APIs use authentication middleware.

Example flow:

Request
|
v
Cookie
|
v
JWT verification
|
v
User role
|
+---- admin ----> allow
|
+---- other ----> reject

The admin dashboard API was successfully tested:

curl -i -b cookies.txt \
http://localhost:5000/api/admin/dashboard

Expected response:

{
"success": true,
"message": "Admin dashboard access granted"
}

7. Categories

Categories represent the main subject grouping for articles.

Example:

Cloudflare

The current database already contains a Cloudflare category.

Category fields include:

name
slug
description
active
createdAt
updatedAt

Category API

GET /api/categories
GET /api/categories/:id
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

The frontend management UI supports:

Create

Read

Search

Edit

Activate

Deactivate

Delete

8. Tags

Tags provide more specific article labels.

Example:

Workers

The current database already contains a Workers tag.

Tag fields include:

name
slug
description
active
createdAt
updatedAt

Tag API

GET /api/tags
GET /api/tags/:id
POST /api/tags
PUT /api/tags/:id
DELETE /api/tags/:id

The frontend supports:

Create

Read

Search

Edit

Activate

Deactivate

Delete

9. Posts

Posts are the main CMS content object.

A post currently contains:

title
slug
excerpt
content
featuredImage
status
category
tags
author
publishedAt
views
seo
createdAt
updatedAt

Status

Posts support the CMS workflow:

Draft
|
v
Published
|
v
Archived

The exact publish/archive behavior should be verified and strengthened
during the Posts Management milestone.

10. SEO

Each post contains SEO information:

metaTitle
metaDescription
keywords
canonicalUrl

Example:

{
"metaTitle": "Getting Started With Cloudflare Workers",
"metaDescription": "Learn the basics of Cloudflare Workers.",
"keywords": [
"Cloudflare",
"Workers",
"Serverless"
],
"canonicalUrl": ""
}

This allows the article editor and future AI Writer to generate SEO
metadata.

11. Existing Test Article

A test article was successfully created:

Title:
Getting Started With Cloudflare Workers

Slug:
getting-started-with-cloudflare-workers

Category:
Cloudflare

Tag:
Workers

Status:
draft

The backend returned HTTP 201 when creating this article.

12. Public Blog

Public blog pages do not require admin authentication.

Routes:

/blog
/blog/:slug

Frontend pages:

PublicBlog.jsx
PublicArticle.jsx

The API client contains:

getPublicPosts()
getPublicPost()
getPublicCategories()
getPublicTags()
getFeaturedPosts()

Public architecture:

Visitor
|
v
/blog
|
v
Public Blog UI
|
v
GET /api/public/posts
|
v
Published content

Individual article:

/blog/getting-started-with-cloudflare-workers

13. Admin Frontend

Admin routes are protected.

/dashboard
/posts
/posts/new
/posts/:id/edit
/categories
/tags

Authentication flow:

ProtectedRoute
|
v
getCurrentUser()
|
+---- authenticated ----> Admin page
|
+---- unauthenticated --> /login

Public routes remain accessible:

/blog
/blog/:slug

14. Article Editor

The article editor is designed to manage:

Title
Excerpt
Content
Category
Tags
SEO
Draft / Published status

The intended workflow is:

Create Article
|
v
Enter Title
|
v
Write Content
|
v
Select Category
|
v
Select Tags
|
v
Configure SEO
|
v
Save Draft
|
v
Review
|
v
Publish

15. API Client

Frontend API requests are centralized in:

apps/web/src/lib/api.js

This prevents every page from implementing its own fetch logic.

The API helper automatically:

Adds /api

Sends JSON

Sends credentials

Parses JSON

Throws API errors

Example:

request("/categories");

The browser sends authentication cookies using:

credentials: "include"

16. Development Commands

Install dependencies

From the repository root:

npm install

API dependencies:

npm --prefix apps/api install

Web dependencies:

npm --prefix apps/web install

Start API

npm --prefix apps/api run dev

Backend:

http://localhost:5000

Start frontend

Open another Git Bash terminal:

npm --prefix apps/web run dev

Frontend:

http://localhost:5173

17. Important Local URLs

Public

http://localhost:5173/blog

Individual article:

http://localhost:5173/blog/getting-started-with-cloudflare-workers

Admin

http://localhost:5173/login
http://localhost:5173/dashboard
http://localhost:5173/posts
http://localhost:5173/categories
http://localhost:5173/tags

18. API Testing With cURL

Authentication:

curl -i -c cookies.txt \
-H "Content-Type: application/json" \
-d '{"email":"admin@example.com","password":"YOUR_PASSWORD"}' \
http://localhost:5000/api/auth/login

Dashboard:

curl -i -b cookies.txt \
http://localhost:5000/api/admin/dashboard

Create category:

curl -i -b cookies.txt \
-H "Content-Type: application/json" \
-d '{"name":"Pages","description":"Cloudflare Pages tutorials"}' \
http://localhost:5000/api/categories

Create tag:

curl -i -b cookies.txt \
-H "Content-Type: application/json" \
-d '{"name":"Pages","description":"Cloudflare Pages"}' \
http://localhost:5000/api/tags

Create a draft post:

curl -i -b cookies.txt \
-H "Content-Type: application/json" \
-d '{
"title":"Getting Started With Cloudflare Workers",
"excerpt":"A beginner-friendly introduction to Cloudflare Workers.",
"content":"Cloudflare Workers allow developers to run server-side code at the edge.",
"status":"draft",
"category":"CATEGORY_ID",
"tags":["TAG_ID"],
"seo":{
"metaTitle":"Getting Started With Cloudflare Workers",
"metaDescription":"Learn the basics of Cloudflare Workers.",
"keywords":["Cloudflare","Workers","Serverless"],
"canonicalUrl":""
}
}' \
http://localhost:5000/api/posts

19. Environment Variables

Secrets must never be committed to Git.

Use:

apps/api/.env

based on:

apps/api/.env.example

Typical values include:

PORT
MONGODB_URI
JWT_SECRET
CLIENT_URL

Never commit:

.env
cookies.txt
JWT secrets
MongoDB credentials
OpenRouter API keys

The repository already uses .gitignore.

20. Git Workflow

Check status:

git status

Review changes:

git diff

Stage:

git add .

Commit:

git commit -m "Describe the change"

Push:

git push

Update local branch:

git pull --rebase origin main

The repository is currently connected to:

https://github.com/marumulge9347/cloudflare-website.git

21. Next Milestones

Milestone 6 --- Finish CMS Management

Current focus:

Categories & Tags
|
v
Posts Management
|
v
Article Editor
|
v
Public Blog

Verify every workflow:

Create category

Edit category

Activate/deactivate category

Delete category

Create tag

Edit tag

Activate/deactivate tag

Delete tag

Search categories

Search tags

Create post

Edit post

Save draft

Publish post

Archive post

Delete post

Search posts

Filter posts

View public post

Verify only published posts appear publicly

22. Milestone 7 --- AI Writer / OpenRouter

After the CMS is stable, add an AI writing service.

Architecture:

Article Editor
|
v
"AI Generate"
|
v
React frontend
|
v
Express API
|
v
AI service
|
v
OpenRouter
|
v
AI model
|
v
Generated result
|
v
Article Editor

AI features planned:

Generate article title

Generate article outline

Generate article content

Generate excerpt

Generate meta title

Generate meta description

Generate SEO keywords

Suggest tags

Suggest category

Rewrite selected content

Expand content

Simplify content

Generate FAQ section

Security rule

The OpenRouter API key must remain on the backend.

Never place it in:

React code
Vite client environment variables
browser localStorage
GitHub

23. Milestone 8 --- Automation Layer

The final automation layer will connect content creation with scheduled
workflows.

Planned architecture:

Content Idea
|
v
AI Research / Generation
|
v
Draft Article
|
v
SEO Generation
|
v
CMS
|
v
Review
|
v
Publish
|
v
Distribution

Potential automation features:

Scheduled article generation

Content idea collection

AI draft generation

SEO generation

Draft creation

Publishing workflow

Featured article rotation

Content calendar

Failed-job retry

Job logs

Notifications

24. Cloudflare Deployment Roadmap

Once local development is stable:

Frontend
|
v
Cloudflare Pages / Workers

Backend
|
v
Cloudflare-compatible deployment

Database
|
v
MongoDB / managed database

AI
|
v
OpenRouter

Automation
|
v
Scheduled workers / queues / workflows

Cloudflare concepts to learn alongside the project:

DNS

CDN

Edge computing

Workers

Pages

KV

R2

D1

Queues

Cron Triggers

Workflows

Caching

WAF

SSL/TLS

HTTP headers

REST APIs

25. Interview Learning Goals

This project should not only be completed; every component should be
understood.

Important topics:

JavaScript

Variables

Functions

Async/await

Promises

Modules

Destructuring

Array methods

Error handling

React

Components

Props

State

useState

useEffect

Forms

Routing

Protected routes

API calls

Backend

Node.js

Express

Middleware

Controllers

Routes

Services

REST APIs

HTTP methods

HTTP status codes

Cookies

JWT

Database

MongoDB

MongoDB documents

Collections

Mongoose

Schemas

References

CRUD

Indexes

Querying

Security

Authentication

Authorization

Password hashing

JWT

HTTP-only cookies

CORS

Environment variables

Secrets management

Input validation

Cloudflare

DNS

CDN

Workers

Edge computing

Caching

WAF

R2

KV

Queues

Cron

Workflows

26. Definition of Done

The project will be considered a complete CMS when a user can:

Login
|
v
Dashboard
|
+--> Categories
|
+--> Tags
|
+--> Posts
|
v
Create Article
|
v
Edit Article
|
v
Save Draft
|
v
Publish
|
v
Public Blog

Then AI:

Article Editor
|
v
AI Writer
|
v
Generate content + SEO
|
v
Draft
|
v
Publish

Then automation:

Scheduled Trigger
|
v
AI Content Workflow
|
v
CMS Draft
|
v
Review / Publish
|
v
Public Blog

27. Immediate Next Task

Before adding AI, complete and verify:

1. Protected admin routes
2. Categories UI
3. Tags UI
4. Posts Management
5. Article Editor
6. Public Blog
7. Draft → Published workflow
8. Public API filtering
9. Error handling
10. Git commit

Only after these are stable should OpenRouter be added.

This prevents AI code from being mixed into an unstable CMS.

28. Current Development Principle

Build in this order:

Foundation
↓
Authentication
↓
CMS API
↓
Admin UI
↓
Public API
↓
Public UI
↓
AI
↓
Automation
↓
Cloudflare deployment

The goal is to understand each layer instead of copying a large
application without understanding how it works.

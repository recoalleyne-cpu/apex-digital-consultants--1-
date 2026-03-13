Apex Digital Consultants – System Architecture

This document explains how the entire system works, including frontend components, backend APIs, database structure, and media storage.

AI coding agents must reference this document before making architectural changes.

1. System Overview

Apex Digital Consultants is a database-driven marketing website with a lightweight CMS.

The system allows dynamic content management without editing code.

Core capabilities include:

• media management
• portfolio management
• homepage logo ticker
• dynamic images on pages
• admin upload interface

2. High Level Architecture
Browser
   │
React Frontend
   │
Vercel API Routes
   │
Neon Postgres
   │
Vercel Blob Storage

Frontend pages request data from API routes.

API routes interact with:

• Neon Postgres (structured data)
• Vercel Blob (media files)

3. Frontend Framework

Frontend uses:

React
Vite
TailwindCSS
Framer Motion
React Router

Pages are located in:

/src/pages

Reusable UI components live in:

/src/components
4. Routing System

The main router is:

src/App.tsx

Routes include:

/
/about
/services
/digital-solutions
/portfolio
/pricing
/contact
/faqs
/blog
/terms
/privacy
/services/web-design
/services/logos
/services/websites
/admin/media
5. Media CMS System

Media is stored in two places:

Vercel Blob

Stores actual files:

images
logos
portfolio images
founder image
certification logos

Example URL:

https://<blob-storage>.public.blob.vercel-storage.com/file.jpeg
Neon Postgres

Stores metadata.

Table:

media

Fields:

id
title
file_url
alt_text
category
placement
created_at
6. Media API
Upload
POST /api/upload

Process:

File uploaded from admin panel

Stored in Vercel Blob

Metadata stored in Postgres

Retrieve Media
GET /api/media

Supports filtering.

Example:

/api/media?placement=about-founder

or

/api/media?category=portfolio
7. Portfolio System

Portfolio content is dynamically loaded.

Endpoint:

/api/portfolio

Returns:

{
  "success": true,
  "items": []
}

Each portfolio item may contain:

• image
• title
• description
• technologies used
• site features

8. Homepage Certification Ticker

Logos are pulled dynamically.

Query:

/api/media?placement=home-certification-ticker

Design rules:

• logos large
• infinite scroll animation
• pause on hover
• centered container

9. About Page Dynamic Image

Founder image is dynamic.

Placement value:

about-founder

Frontend query:

/api/media?placement=about-founder
10. Admin Media Panel

Admin page:

/admin/media

Capabilities:

• upload images
• assign category
• assign placement
• store in blob + database

Admin page file:

src/pages/AdminMedia.tsx
11. Portfolio Image Viewer

Portfolio images support:

• modal viewer
• zoom
• smooth animation

Viewer is implemented in React using:

Framer Motion
12. Design System

The visual style follows a minimal Apple-inspired interface.

Principles:

• large whitespace
• modern typography
• smooth motion
• high contrast sections

Spacing rules:

section-padding
container-wide
13. Deployment Architecture

Deployment platform:

Vercel

Deployment flow:

git push → Vercel build → serverless functions deploy

Production environment must be compatible with:

Vercel Node runtime
14. API Performance Requirements

API routes must remain lightweight.

Guidelines:

• avoid heavy queries
• avoid unnecessary joins
• return minimal data

Portfolio API must respond within:

< 5 seconds
15. Known Platform Constraints

Vercel serverless environment does not support certain Node modules.

Avoid:

node:stream
node:net
node:tls
undici

Edge runtime limitations must also be respected.

16. Error Handling

UI must never remain stuck in loading state.

Correct behavior:

Loading
→ Timeout
→ Show fallback message

Example fallback:

Portfolio request failed or timed out
17. Git Workflow

All changes must follow:

git add .
git commit -m "clear descriptive message"
git push origin main

Vercel deploys automatically from the main branch.

18. Approved CMS Expansion

Future modules planned:

• testimonials CMS
• blog CMS
• case studies
• SEO landing pages
• plugin marketplace
• analytics dashboard

All must reuse the existing:

Postgres + Blob architecture
19. Development Commands

Local development:

npm install
npm run dev

Vercel local environment:

npx vercel dev

Build test:

npm run build
20. AI Agent Development Rules

Agents must:

Identify root cause before editing code

Apply minimal changes

Preserve working CMS functionality

Maintain compatibility with Vercel runtime

Avoid unnecessary refactoring

When uncertain:

prefer stability over cleverness
Final Note

This project is designed to evolve into a full marketing platform powered by database-driven content.

Agents should prioritize maintaining a scalable architecture rather than adding isolated static features.
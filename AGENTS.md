Apex Digital Consultants – AI Agent Development Guide

This document defines the approved architecture, conventions, and guardrails for AI coding agents (Codex, Cursor, Copilot, etc.) working on the Apex Digital Consultants project.

Agents must follow these rules to ensure stability of the production site and maintain compatibility with the Vercel deployment environment.

Project Overview

Apex Digital Consultants is a database-driven marketing website with a built-in CMS powered by:

React + Vite

Vercel deployment

Vercel Blob (media storage)

Neon Postgres database

Serverless API routes

The site behaves like a lightweight marketing SaaS platform, allowing media, portfolio items, and images to be managed dynamically.

Approved Technology Stack

Frontend

React
Vite
TailwindCSS
Framer Motion
React Router

Backend

Vercel Serverless API routes
Neon Postgres
Vercel Blob Storage

Deployment

Vercel
Repository Structure
/api
   media.ts
   portfolio.ts
   upload.ts

/src
   /components
   /pages
      Home.tsx
      About.tsx
      Services.tsx
      Portfolio.tsx
      Contact.tsx
      Pricing.tsx
      DigitalSolutions.tsx
      AdminMedia.tsx

/vercel.json
/package.json
CMS System (Already Implemented)

The site includes a custom CMS layer.

Media Storage

Images are uploaded to:

Vercel Blob

Metadata is stored in:

Neon Postgres

Schema example:

media
 id
 title
 file_url
 alt_text
 category
 placement
 created_at
API Endpoints
Upload Media
POST /api/upload

Uploads files to Blob and saves metadata to Postgres.

Get Media
GET /api/media

Optional filters:

?placement=
?category=

Example:

/api/media?placement=about-founder
Portfolio Data
GET /api/portfolio

Returns portfolio items used by the Portfolio page.

Important:

The portfolio endpoint must always return quickly to avoid Vercel function timeouts.

Frontend Dynamic Areas

The following sections are database driven.

About Page

Founder image loads dynamically.

Query:

/api/media?placement=about-founder
Certification Ticker

Homepage certification logos.

Query:

/api/media?placement=home-certification-ticker
Portfolio

Portfolio page loads from:

/api/portfolio

If the API fails, the UI must show:

Portfolio request failed or timed out

Never leave the page stuck on loading.

Admin CMS Page

Admin panel:

/admin/media

Capabilities:

upload media
assign placement
assign category
store in blob + postgres
Design Rules

The visual system must remain consistent.

Design style:

Apple-inspired
minimal
high whitespace
smooth motion

Spacing rules:

section padding: section-padding
containers: container-wide

Motion:

Framer Motion
Homepage Components

The homepage includes:

Hero
Certification ticker
Services preview
Portfolio preview
Testimonials
Call to action

Ticker rules:

logos must be large
pause on hover
infinite scroll
Portfolio Page

Features:

dynamic portfolio images
modal viewer
zoom capability
technology stack text
feature descriptions

Portfolio images must support:

click to enlarge
click to zoom
smooth modal animation
Deployment Environment

All code must run inside:

Vercel serverless runtime

Unsupported Node modules must not be used.

Edge functions must avoid:

undici
node streams
node tls
node net
Performance Requirements

Portfolio and media APIs must:

respond under 5 seconds
avoid heavy queries
avoid blocking operations

If Neon cold start occurs:

fail gracefully
return fallback UI
Error Handling Rules

Never allow the UI to hang.

Bad:

Loading forever

Correct:

Loading
→ Timeout
→ Show fallback message
Git Workflow

All changes follow this pattern.

git add .
git commit -m "clear descriptive message"
git push origin main

Vercel auto deploys from main.

Codex Agent Rules

When modifying the project:

Always

Identify root cause first

Propose minimal changes

Preserve working features

Avoid editing unrelated files

Maintain Vercel compatibility

Keep APIs lightweight

Never

Do not:

rewrite working components
change project structure without reason
introduce heavy libraries
break CMS integration
Preferred Codex Workflow

Codex should operate in this sequence.

Audit files

Identify root cause

Explain issue

Apply minimal fix

Verify build

Confirm runtime compatibility

Summarize changes

Long Term Architecture Vision

This site will evolve into a full marketing platform including:

CMS media
dynamic portfolio
testimonials CMS
blog CMS
SEO landing pages
plugin marketplace
analytics dashboard

All powered by the existing:

Postgres + Blob architecture
Commands Codex Can Use

Start local environment:

npm install
npm run dev

Vercel local dev:

npx vercel dev

Build check:

npm run build
Final Rule

When unsure:

prefer stability over cleverness

The production site must always remain deployable on Vercel.

## Codex Development Protocol

Before performing any work in this repository, the agent must read the following files:

- PROJECT_ROADMAP.md
- PROJECT_ARCHITECTURE.md
- DATABASE_SCHEMA_PLAN.md
- FEATURE_ROADMAP.md
- CODEX_TASK_PLAYBOOK.md

These files define the approved architecture and development direction for the Apex Digital Consultants platform.

---

## Project Context

This repository powers the **Apex Digital Consultants marketing platform and CMS system**.

Technology stack:

- React + Vite
- Tailwind CSS
- Vercel hosting
- Neon Postgres
- Vercel Blob Storage
- Serverless API routes

The system functions as both:

1. A marketing website
2. A lightweight CMS platform

---

## Hosting Constraints

This project runs on:

Vercel Hobby Plan + Neon Free Tier

The agent must design solutions that respect:

- serverless cold starts
- minimal dependencies in API routes
- lightweight database queries
- minimal runtime memory usage

Heavy libraries or server frameworks should be avoided.

---

## Approved CMS Architecture

The platform uses the **media table as the central asset registry**.

Media items power:

- certification ticker
- founder image
- portfolio grid
- logos page
- testimonials
- landing pages

Blog posts and landing pages are stored in dedicated tables.

---

## Development Principles

The agent must:

1. Audit existing code before making changes
2. Avoid modifying unrelated files
3. Prefer minimal safe changes
4. Preserve the current design language
5. Maintain compatibility with Vercel Hobby
6. Ensure all APIs return fast responses
7. Avoid blocking UI states

---

## Required Workflow

When performing tasks the agent should:

1. Audit the repository
2. Explain the architectural choice
3. Implement minimal safe code
4. Verify local build
5. Verify API behavior
6. Summarize changes clearly
7. Provide git commands

---

## Stop Conditions

The agent must stop and request human input if:

- database schema changes are required
- DNS configuration is needed
- domain connection is requested
- production deployment decisions are needed
- architecture changes are proposed

---

## Launch Awareness

The final launch sequence for this project is:

1. CMS systems verified
2. dynamic content verified
3. mobile QA completed
4. SEO setup confirmed
5. domain connected
6. site indexed

The agent must **not attempt to configure domains automatically**.
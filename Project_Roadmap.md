PROJECT_ROADMAP.md
# Apex Digital Consultants — Project Roadmap

## Project Overview

This project is a **modern marketing website + lightweight CMS platform** for Apex Digital Consultants built with:

- React + Vite
- Tailwind CSS
- Vercel Hosting
- Vercel Blob Storage
- Neon Postgres Database
- Custom API routes
- Lightweight CMS architecture

The site is designed to function as both:

1. A **high-end marketing website**
2. A **content management platform** for media, blog posts, landing pages, testimonials, and portfolio items.

The architecture prioritizes:

- Vercel Hobby compatibility
- lightweight APIs
- serverless constraints
- maintainability
- SEO scalability

---

# Hosting Constraints

The system must remain compatible with:

### Vercel Hobby Plan
Key constraints include:

- serverless request body limit ≈ **4.5MB** :contentReference[oaicite:0]{index=0}
- API functions should remain lightweight
- avoid heavy dependencies in API routes
- prefer client uploads for media

### Neon Free Tier
- small query volumes
- efficient queries required
- avoid unnecessary joins

---

# Core Architecture

### Frontend
React + Vite

Key directories:


src/pages
src/components
src/constants


### Backend APIs


/api/media.ts
/api/upload.ts
/api/portfolio.ts
/api/blog.ts
/api/testimonials.ts


### Storage

Media assets:


Vercel Blob Storage


Structured content:


Neon Postgres


---

# Database Tables

## media

Stores all uploaded media items.

Fields:


id
title
file_url
alt_text
category
placement
description
tech_stack
features
created_at


Used by:

- portfolio
- logos page
- certification ticker
- founder image
- testimonials
- landing pages

---

## blog_posts

Stores blog articles.

Fields:


id
title
slug
excerpt
body_content
featured_image_url
category
author_name
publish_date
is_published
seo_title
seo_description


---

## landing_pages

Stores SEO landing pages.

Fields:


id
title
slug
hero_heading
hero_subheading
body_content
featured_image_url
cta_text
cta_link
seo_title
seo_description
region
service_category
is_published


---

# Completed Features

## Core Website

Completed pages:

- Home
- About
- Services
- Pricing
- Portfolio
- Contact
- FAQs
- Blog
- Logos
- Digital Solutions

Design system includes:

- frosted homepage hero
- certification ticker
- responsive layout
- premium glass UI elements

---

# CMS Systems

## Media CMS

Admin upload interface:


/admin/media


Supports:

- single uploads
- bulk uploads
- metadata editing

Uploads use **Vercel Blob client uploads**.

---

## Portfolio CMS

Dynamic portfolio system using:


category=portfolio


Supports:

- image
- description
- tech stack
- features

---

## Testimonials CMS

Dynamic testimonials.

Future upgrade planned:


Google Reviews import


---

## Blog CMS

Supports:

- blog listing page
- dynamic blog posts
- SEO fields

---

## Landing Page Generator

Dynamic SEO landing pages.

Supports:

- AI assisted content
- bulk page generation
- location/service combinations

---

# Dynamic Content Areas

The following site sections are CMS-driven.

| Section | Data Source |
|------|------|
Homepage certification ticker | media table
Founder image | media table
Portfolio grid | media table
Logos page | media table
Testimonials | testimonials table
Blog | blog_posts table
SEO landing pages | landing_pages table

---

# Remaining Development Tasks

## Media System Stabilization

Remaining improvements:

- ensure bulk uploads map correctly to metadata
- validate image file types
- improve upload feedback

---

## Admin Panel Expansion

Planned admin pages:


/admin/blog
/admin/testimonials
/admin/landing-pages
/admin/portfolio


Each should support:

- create
- edit
- delete

---

## SEO Improvements

Add:

- sitemap generation
- structured metadata
- Open Graph tags
- canonical URLs
- internal linking strategy

---

## Blog Enhancements

Future features:

- blog categories
- related posts
- featured articles
- blog search

---

## Testimonials Enhancements

Future improvements:

- Google Reviews import
- rating display
- testimonial carousel

---

## Portfolio Enhancements

Planned improvements:

- case study pages
- portfolio filters
- project detail views

---

# Conversion Optimization

Improve:

- CTA placements
- lead capture flows
- portfolio case studies
- service landing pages

---

# SEO Landing Page Expansion

Goal:

Generate scalable pages like:


/google-ads-barbados
/web-design-barbados
/seo-services-caribbean


Using the landing_pages CMS.

---

# Launch Preparation Checklist

Before connecting a domain and going live:

## Content Review

Confirm final content for:

- services
- portfolio
- testimonials
- logos
- blog
- landing pages

---

## SEO Setup

Ensure:

- page titles
- meta descriptions
- Open Graph images
- Google Search Console
- analytics tracking

---

## QA Testing

Test across:

- mobile
- tablet
- desktop

Verify:

- all API routes
- uploads
- CMS pages
- navigation
- forms

---

# Launch Steps

Once QA passes:

1. Connect domain
2. Configure DNS
3. Verify SSL
4. Submit sitemap
5. Index site in Google
6. Launch publicly

---

# Final Launch Condition

The site is considered **launch-ready** when:

- all CMS systems are functional
- dynamic content loads correctly
- uploads function reliably
- mobile layout is verified
- all primary pages are finalized

Only then should the domain be connected.

---

# Codex Agent Instructions

Codex should:

1. Read this roadmap before implementing new features
2. Prefer minimal safe changes
3. Maintain Vercel Hobby compatibility
4. Avoid introducing heavy dependencies
5. Follow existing CMS architecture

Codex should stop and request human input when:

- database schema changes are required
- domain configuration is needed
- launch readiness is reached
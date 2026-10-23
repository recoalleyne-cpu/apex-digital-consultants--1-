Apex Digital Consultants – Database Schema Roadmap

This document defines the approved database schema plan for Apex Digital Consultants.

Its purpose is to ensure that future features are built on a consistent, scalable Postgres structure.

AI agents must use this file before creating new tables or modifying existing schema.

1. Guiding Principles

The database must remain:

simple

scalable

easy to query

compatible with Vercel serverless functions

aligned with the current Postgres + Blob CMS architecture

Rules:

Use Blob for files and images

Use Postgres for structured content and metadata

Avoid duplicate tables that store the same concept

Prefer adding structured fields over storing critical content in unstructured JSON

Keep queries lightweight for Vercel functions

2. Current Existing Table
media

Purpose:
Stores uploaded media and metadata.

Approved fields:

id SERIAL PRIMARY KEY
title TEXT NOT NULL
file_url TEXT NOT NULL
alt_text TEXT
category TEXT
placement TEXT
description TEXT
tech_stack TEXT
features TEXT
created_at TIMESTAMP DEFAULT NOW()

Uses:

founder image

homepage certification ticker

portfolio image records

other future page images

Notes:

file_url points to Vercel Blob

category groups similar content

placement targets exact frontend locations

3. Approved Future Tables
A. testimonials

Purpose:
Stores manual testimonials and future imported review content.

id SERIAL PRIMARY KEY
name TEXT NOT NULL
company TEXT
role TEXT
quote TEXT NOT NULL
rating INTEGER DEFAULT 5
image_url TEXT
featured BOOLEAN DEFAULT TRUE
source TEXT
created_at TIMESTAMP DEFAULT NOW()

Use cases:

homepage testimonials

testimonials page

trust sections across landing pages

Notes:

image_url should point to Blob or external review avatar

source can be values like:

manual

google

client-email

B. blog_posts

Purpose:
Stores blog content for the future blog CMS.

id SERIAL PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
excerpt TEXT
body_content TEXT NOT NULL
featured_image_url TEXT
category TEXT
author_name TEXT
publish_date TIMESTAMP
is_published BOOLEAN DEFAULT FALSE
seo_title TEXT
seo_description TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

Use cases:

blog listing page

article detail pages

SEO content marketing

Notes:

slug must be unique

use is_published to control visibility

C. landing_pages

Purpose:
Stores SEO landing pages and targeted service pages.

id SERIAL PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
hero_heading TEXT
hero_subheading TEXT
body_content TEXT NOT NULL
featured_image_url TEXT
cta_text TEXT
cta_link TEXT
seo_title TEXT
seo_description TEXT
region TEXT
service_category TEXT
is_published BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

Use cases:

web-design-barbados

digital-marketing-barbados

wordpress-development-caribbean

Notes:

slug is used in routing

region and service_category help organize landing pages

D. products

Purpose:
Stores digital solutions, plugins, templates, and future marketplace products.

id SERIAL PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
short_description TEXT
full_description TEXT
price TEXT
image_url TEXT
category TEXT
cta_url TEXT
is_featured BOOLEAN DEFAULT FALSE
is_published BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

Use cases:

Digital Solutions page

plugin marketplace

future product catalogue

Notes:

cta_url can be an external checkout or internal product page

price kept as TEXT initially for flexibility

E. case_studies

Purpose:
Stores more detailed project/case study content beyond the simple portfolio cards.

id SERIAL PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
client_name TEXT
summary TEXT
challenge TEXT
solution TEXT
results TEXT
featured_image_url TEXT
gallery_images TEXT
tech_stack TEXT
cta_text TEXT
cta_link TEXT
is_featured BOOLEAN DEFAULT FALSE
is_published BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

Use cases:

long-form project pages

premium portfolio storytelling

conversion-oriented proof pages

Notes:

gallery_images can start as a comma-separated list of URLs

could later be normalized if needed

F. lead_submissions

Purpose:
Stores qualified leads and future AI-assisted inquiry data.

id SERIAL PRIMARY KEY
first_name TEXT
last_name TEXT
email TEXT NOT NULL
phone TEXT
company_name TEXT
service_interest TEXT
project_details TEXT
budget_range TEXT
status TEXT DEFAULT 'new'
source TEXT
created_at TIMESTAMP DEFAULT NOW()

Use cases:

contact form submissions

AI quote assistant

lead tracking dashboard

Notes:

status examples:

new

contacted

qualified

closed

4. Suggested Build Order for Tables

AI agents should create tables in this order:

testimonials

blog_posts

landing_pages

products

case_studies

lead_submissions

Reason:
This order best supports:

trust

SEO growth

product expansion

lead management

5. Relationship Strategy

For now, keep relationships simple.

Preferred strategy:

use image_url string references first

store media in Blob

store metadata in Postgres

add foreign keys only when clearly beneficial

Do not over-engineer relational complexity too early.

6. Blob Usage Rules

Blob should store:

uploaded images

logos

PDFs

downloadable files

screenshots

gallery assets

Blob should not store structured content like:

testimonial text

blog body content

product descriptions

Those belong in Postgres.

7. Query Design Rules

All database queries must be:

lightweight

explicit

field-limited

compatible with Vercel serverless execution

Prefer:

SELECT title, image_url FROM products WHERE is_published = TRUE

Avoid:

overly broad SELECT * in production endpoints when unnecessary

heavy joins for simple frontend views

returning fields the page does not use

8. Migration Rules

When adding fields:

use ALTER TABLE ... ADD COLUMN IF NOT EXISTS

preserve existing data

avoid destructive schema changes unless explicitly requested

When creating new tables:

use CREATE TABLE IF NOT EXISTS

9. Content Routing Rules

Future dynamic routes should map like this:

Blog
/blog/:slug

Uses:

blog_posts.slug
Landing Pages
/:slug

or a dedicated landing page route pattern if needed

Uses:

landing_pages.slug
Products
/digital-solutions/:slug

Uses:

products.slug
Case Studies
/case-studies/:slug

Uses:

case_studies.slug
10. CMS Admin Expansion Plan

The current admin area is:

/admin/media

Future admin areas should likely expand to:

/admin/testimonials
/admin/blog
/admin/landing-pages
/admin/products
/admin/case-studies
/admin/leads

Each should follow the same pattern:

lightweight form UI

Postgres-backed

Blob integration only when media is required

11. Schema Safety Rules for AI Agents

Before creating a new table, agents must ask:

Does this concept already fit into an existing table?

Can the current media table handle the need?

Is a new structured table actually justified?

Will this remain fast on Vercel serverless functions?

Agents must prefer:

consistent naming

low complexity

future-proof structure

12. Example SQL Snippets
Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  featured BOOLEAN DEFAULT TRUE,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body_content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  author_name TEXT,
  publish_date TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price TEXT,
  image_url TEXT,
  category TEXT,
  cta_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
13. Approved Root Documentation Set

The repo should now ideally contain:

AGENTS.md
PROJECT_ARCHITECTURE.md
CODEX_TASK_PLAYBOOK.md
FEATURE_ROADMAP.md
DATABASE_SCHEMA_PLAN.md

Together, these files give AI agents:

coding rules

system architecture

safe workflow guidance

business feature priorities

future schema design

Final Rule

When expanding the schema, always choose:

simple
clear
scalable

over:

over-abstracted
deeply relational too early
hard-to-query

Apex should remain easy to develop, easy to scale, and easy to reason about.
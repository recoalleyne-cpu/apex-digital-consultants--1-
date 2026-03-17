AUTOMATION_TASK_QUEUE.md
# Apex Digital Consultants — Automation Task Queue

This document gives AI agents (Codex) a structured queue of what to build next, what to stabilize first, and when to stop for human review.

It is designed to let the agent continue useful work automatically **without deviating from the approved project direction**.

---

# How to Use This File

When the user says things like:

- "what’s next?"
- "continue"
- "move to the next task"
- "keep going"
- "work through the backlog"

the agent should use this file to choose the next task.

The agent must always:

1. check for unresolved blockers first
2. choose the highest-priority unfinished task
3. prefer stabilization over expansion
4. stop when human approval is needed

---

# Task Status Legend

Use these statuses:

- `todo`
- `in_progress`
- `blocked`
- `done`
- `needs_human_review`

Agents should update status mentally during work, but only modify this file if explicitly asked.

---

# Priority Rules

The agent must prioritize in this order:

## Priority 1 — Stabilize core systems
Fix anything that breaks:
- uploads
- API routes
- production deploys
- dynamic content rendering
- mobile responsiveness

## Priority 2 — Finish launch-critical features
Complete the systems required to make the site launch-ready:
- logos page working
- CMS flows verified
- blog working
- landing pages working
- testimonials working
- SEO basics

## Priority 3 — Add growth systems
Only after launch-critical items are stable:
- AI-assisted content generation
- bulk landing page generation
- Google Reviews import
- case studies
- marketplace enhancements

---

# Current Project State

## Already Completed
- core public site pages
- frosted homepage hero
- certification ticker
- mobile responsiveness improvements
- founder image CMS
- portfolio CMS
- testimonials CMS foundation
- blog CMS foundation
- SEO landing page foundation
- live dynamic landing page template
- AI-assisted landing page generation foundation
- bulk landing page generation foundation
- admin media workflow
- admin blog workflow
- media APIs
- portfolio API
- blog API
- testimonials API foundations

## Current Known Areas to Stabilize
- logos page upload/display workflow
- bulk image upload reliability
- ensuring uploaded files map correctly to front-end placements
- production readiness checks across all dynamic pages

---

# Active Queue

## Queue Item 01
### Title
Fix and verify Logos page CMS flow

### Status
`todo`

### Why this matters
The site cannot be considered launch-ready if uploaded logos do not reliably appear on the Logos page.

### Definition of done
- valid image uploads succeed
- metadata saves correctly
- `/api/media?placement=logos-page` returns uploaded logos
- Logos page renders uploaded images
- bulk upload workflow is reliable
- non-image uploads are blocked or clearly rejected

### Stop conditions
Stop for human review if:
- database schema changes are required
- Vercel production behavior differs unexpectedly from local

---

## Queue Item 02
### Title
Run full dynamic content QA pass

### Status
`todo`

### Why this matters
Before launch, all CMS-driven content areas must be verified.

### Areas to verify
- founder image
- certification ticker
- portfolio page
- testimonials section
- blog listing
- blog single post pages
- landing pages
- logos page
- admin create flows

### Definition of done
- each dynamic area works locally
- each dynamic area works in Vercel production
- no page remains in an infinite loading state
- all fallback states are sensible

### Stop conditions
Stop for human review if:
- production-only infrastructure issues appear
- DNS/domain questions arise

---

## Queue Item 03
### Title
Finalize SEO basics

### Status
`todo`

### Why this matters
Launch quality depends on metadata and search readiness.

### Include
- page titles
- meta descriptions
- Open Graph defaults
- favicon / share image verification
- sitemap strategy
- Google Search Console readiness

### Definition of done
- key public pages have sensible metadata
- blog and landing pages use SEO fields correctly
- launch can proceed without major SEO gaps

### Stop conditions
Stop for human review if:
- brand/legal copy needs approval
- sitemap/domain setup is required

---

## Queue Item 04
### Title
Launch readiness review

### Status
`todo`

### Why this matters
This is the final gate before domain connection.

### Include
- content review
- route review
- mobile review
- forms/buttons review
- production deployment review
- legal/privacy/basic business details review

### Definition of done
- site is stable
- content is approved
- launch blockers are listed clearly
- project is ready for domain connection

### Stop conditions
Always stop and request human review at the end of this step.

---

# Post-Launch Queue

These tasks should only be worked on **after** launch-critical items are stable and approved.

## Queue Item 05
### Title
Google Reviews import for testimonials

### Status
`todo`

### Goal
Allow Google reviews to sync/import into the testimonials CMS without live homepage dependency.

---

## Queue Item 06
### Title
Case studies system

### Status
`todo`

### Goal
Create long-form, high-conversion project proof pages linked from portfolio items.

---

## Queue Item 07
### Title
Blog enhancements

### Status
`todo`

### Goal
Add categories, featured posts, related posts, and stronger SEO behavior.

---

## Queue Item 08
### Title
Landing page generation scale-up

### Status
`todo`

### Goal
Expand AI-assisted and bulk-generated landing pages into a scalable SEO engine.

---

## Queue Item 09
### Title
Digital solutions / plugin marketplace refinement

### Status
`todo`

### Goal
Turn the Digital Solutions area into a stronger product showcase and sales system.

---

## Queue Item 10
### Title
Analytics and lead tracking layer

### Status
`todo`

### Goal
Track leads, content usage, and engagement across dynamic site sections.

---

# Agent Decision Rules

When choosing the next task, the agent must:

1. pick the first unfinished launch-critical item
2. prefer bug fixes over new features
3. prefer launch blockers over nice-to-have improvements
4. avoid introducing new systems when an existing CMS pattern can be reused
5. stop for human review when a task reaches:
   - domain setup
   - DNS changes
   - schema changes
   - infrastructure decisions
   - launch approval

---

# Required Output Style for Each Completed Task

When the agent completes a task, it should report:

- root cause or reason for the task
- architecture decision
- files changed
- exact summary of the implementation
- what is now complete
- what the next logical task is
- recommended git commit message
- exact git add / commit / push commands

---

# Final Launch Gate

The agent must stop and request human intervention when the project reaches this state:

- core pages finalized
- dynamic content systems working
- uploads working
- mobile QA complete
- SEO basics complete
- launch readiness review complete

At that point the next human-led steps are:

1. connect domain
2. update DNS
3. verify SSL
4. test live domain
5. submit sitemap
6. go live

The agent must **not** attempt to connect domains or modify DNS automatically.

---

# Final Rule

When uncertain, the agent must choose:

- safer
- smaller
- launch-oriented
- easier to verify

over:

- more complex
- more experimental
- more abstract
- less proven
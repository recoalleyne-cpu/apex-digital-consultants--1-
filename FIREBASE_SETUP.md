# Firebase Auth + Neon Postgres Setup

This project now uses a hybrid architecture:

- Firebase Authentication for sign-in and user identity
- Neon Postgres for primary content and business data
- Firestore helpers remain optional scaffolding only (not the primary content store)

## Architecture Summary

- `src/lib/firebase.ts` initializes the Firebase web app once (`getApps()` / `getApp()`).
- `src/lib/auth.ts` provides Firebase Auth helpers for email/password flows.
- API routes verify Firebase ID tokens server-side via Firebase Admin SDK.
- Neon-backed repositories in `api/_utils/contentRepository.ts` handle case studies, portfolio items, and leads.

## Required Environment Variables

### Client-side (Firebase Web SDK)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Server-side (Firebase Admin SDK for API token verification)

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `ADMIN_ALLOWED_EMAILS` (optional comma-separated allowlist for admin API access)

### Server-side (Neon Postgres)

- `DATABASE_URL` (preferred)
- `DATABASE_URL_UNPOOLED` (optional)
- `POSTGRES_URL` (legacy fallback supported)

## Firebase Console Steps

1. Create a Firebase project.
2. Register a Web App and copy web config to `VITE_FIREBASE_*`.
3. Enable Authentication -> Email/Password.
4. Create or use admin users in Firebase Auth.
5. Create a service account key in Firebase/GCP and map values to:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`

Note: For `.env` files, keep private key newlines escaped as `\\n`.

## Neon Setup Steps

1. Create a Neon project and database.
2. Copy connection string into `DATABASE_URL`.
3. Initialize schema + seed content:

```bash
npm run db:init:neon
```

This initializes/scaffolds:

- `case_studies`
- `portfolio_items`
- `leads`

## Vercel Steps

1. Add all required Firebase + Neon variables in:
   - Project Settings -> Environment Variables
2. Apply variables to Production/Preview/Development as needed.
3. Redeploy after env changes.

Vercel env changes are applied to new deployments only.

## Runtime Notes

- Admin login uses Firebase Auth from the client.
- Protected admin API routes validate bearer tokens with Firebase Admin SDK.
- Main business/content data is read/written in Neon (server-side).
- Public site behavior remains unchanged unless endpoints are consuming the new Neon-backed tables.


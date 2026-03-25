import { neon } from '@neondatabase/serverless';

let cachedUrl = '';
let cachedSql: ReturnType<typeof neon> | null = null;

const resolveDatabaseUrl = () => {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED
  ];

  for (const value of candidates) {
    const normalized = typeof value === 'string' ? value.trim() : '';
    if (normalized) {
      return normalized;
    }
  }

  return '';
};

export const getDatabaseUrl = () => resolveDatabaseUrl();

export const isNeonConfigured = () => Boolean(resolveDatabaseUrl());

export const getSqlClient = () => {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    throw new Error(
      'Missing database connection string. Set DATABASE_URL (preferred) or POSTGRES_URL.'
    );
  }

  if (!cachedSql || cachedUrl !== databaseUrl) {
    cachedSql = neon(databaseUrl);
    cachedUrl = databaseUrl;
  }

  return cachedSql;
};


import 'dotenv/config';
import {
  ensureHybridContentSchema,
  seedCoreContentTables
} from '../server/api-shared/contentRepository';
import { getSqlClient, isNeonConfigured } from '../server/api-shared/neonDb';

const run = async () => {
  if (!isNeonConfigured()) {
    throw new Error('Missing DATABASE_URL (or POSTGRES_URL).');
  }

  const sql = getSqlClient();
  await ensureHybridContentSchema(sql);
  await seedCoreContentTables(sql);

  console.log('Neon content schema is initialized and seed data is ready.');
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Neon init failed.');
  process.exit(1);
});

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from './schema';

// Hardcoded database URL
const DATABASE_URL = 'postgresql://neondb_owner:npg_qBKH7QWcJn1y@ep-odd-darkness-a1tdsv2s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const runMigration = async () => {
  try {
    console.log('Initializing database connection...');
    const sql = neon(DATABASE_URL);
    const db = drizzle(sql, { schema });

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed!', error);
    process.exit(1);
  }
};

runMigration();

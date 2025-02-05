import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const runMigration = async () => {
  try {
    console.log('Initializing database connection...');
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed!', error);
    process.exit(1);
  }
};

runMigration();

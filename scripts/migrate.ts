import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blue_collar_connect');
  const db = drizzle(sql);

  try {
    // Read the migration file
    const migration = fs.readFileSync(path.join(__dirname, '../migrations/0002_add_application_form_fields.sql'), 'utf-8');
    
    // Execute the migration
    await sql.unsafe(migration);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await sql.end();
  }
}

runMigration();

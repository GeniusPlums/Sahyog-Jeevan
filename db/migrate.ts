import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from './schema';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables directly from .env file
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse the .env file content
    const envVars = envContent.split('\n').reduce((acc, line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        acc[key] = value;
      }
      return acc;
    }, {});
    
    // Add the variables to process.env
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    console.log('Environment variables loaded successfully');
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
}

// Load environment variables
loadEnv();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env file");
}

const runMigration = async () => {
  try {
    console.log('Initializing database connection...');
    const sql = neon(process.env.DATABASE_URL);
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

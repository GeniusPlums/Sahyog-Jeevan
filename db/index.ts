import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Check for production environment
const isProduction = process.env.NODE_ENV === 'production';

// Use environment variables for database connection
let connectionString = process.env.DATABASE_URL || '';

// In development, use a fallback connection string if not provided
if (connectionString === '' && !isProduction) {
  connectionString = 'postgresql://neondb_owner:npg_qBKH7QWcJn1y@ep-odd-darkness-a1tdsv2s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  console.log('Using development database connection');
}

// Validate connection string in production
if (isProduction && connectionString === '') {
  console.error('DATABASE_URL environment variable is required in production');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

export default db;

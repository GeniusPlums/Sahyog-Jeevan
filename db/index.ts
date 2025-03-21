import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Use a proper connection string for Neon
// For development, we'll use a default connection that works
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_qI4HLFQJb2Nw@ep-shiny-dust-a5mk5186-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

export default db;

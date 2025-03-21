import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to the database
const sql = neon(process.env.DATABASE_URL);

async function addMissingColumns() {
  try {
    console.log('Adding missing columns to applications table...');
    
    // Check if columns exist first to avoid errors
    const checkGenderColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'gender'
    `;
    
    if (checkGenderColumn.length === 0) {
      console.log('Adding gender column...');
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS gender TEXT`;
    }
    
    const checkExperienceColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'experience'
    `;
    
    if (checkExperienceColumn.length === 0) {
      console.log('Adding experience column...');
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS experience TEXT`;
    }
    
    const checkShiftColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'shift'
    `;
    
    if (checkShiftColumn.length === 0) {
      console.log('Adding shift column...');
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS shift TEXT`;
    }
    
    const checkProfileImageColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'profile_image'
    `;
    
    if (checkProfileImageColumn.length === 0) {
      console.log('Adding profile_image column...');
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS profile_image TEXT`;
    }
    
    console.log('All missing columns added successfully!');
  } catch (error) {
    console.error('Error adding columns:', error);
  } finally {
    process.exit(0);
  }
}

addMissingColumns();

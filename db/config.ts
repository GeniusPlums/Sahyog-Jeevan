import * as path from 'path';
import * as fs from 'fs';

// Function to load environment variables from .env file
export function loadEnvConfig() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse the .env file content
    const envVars = envContent.split('\n').reduce((acc: Record<string, string>, line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        acc[key] = value;
      }
      return acc;
    }, {});
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
}

// Get database configuration
export function getDatabaseConfig() {
  const envVars = loadEnvConfig();
  const databaseUrl = envVars['DATABASE_URL'];
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in .env file');
  }
  
  return { databaseUrl };
}

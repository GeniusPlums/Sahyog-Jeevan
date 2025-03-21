import * as dotenv from 'dotenv';

// Force dotenv to load from the .env file
dotenv.config({ path: './.env' });

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Env file loaded:', dotenv.config({ path: './.env' }));

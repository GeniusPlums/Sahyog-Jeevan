-- Add new columns to applications table for job application form
ALTER TABLE applications
ADD COLUMN gender text,
ADD COLUMN experience text,
ADD COLUMN shift text,
ADD COLUMN profile_image text;

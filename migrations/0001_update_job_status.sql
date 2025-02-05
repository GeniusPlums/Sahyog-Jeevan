-- Update existing jobs with 'active' status to 'open'
UPDATE jobs SET status = 'open' WHERE status = 'active';

-- Update existing jobs with 'draft' status to 'closed'
UPDATE jobs SET status = 'closed' WHERE status = 'draft';

-- Update any remaining jobs with invalid status to 'closed'
UPDATE jobs SET status = 'closed' WHERE status NOT IN ('open', 'closed');

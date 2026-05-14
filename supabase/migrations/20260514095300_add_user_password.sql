-- Add password column to users table for demo purposes
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

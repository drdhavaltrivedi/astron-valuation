-- Add charges column to banks table
ALTER TABLE banks ADD COLUMN IF NOT EXISTS valuation_fee NUMERIC DEFAULT 0;

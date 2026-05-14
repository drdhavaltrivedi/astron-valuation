-- Randomly assign charges (1000, 1200, 1500) to all existing banks
UPDATE banks
SET valuation_fee = (ARRAY[1000, 1200, 1500])[floor(random() * 3 + 1)];

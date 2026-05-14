-- Add more banks
INSERT INTO banks (name, code)
VALUES 
    ('State Bank of India', 'SBI'),
    ('Punjab National Bank', 'PNB'),
    ('Bank of Baroda', 'BOB'),
    ('Canara Bank', 'CANARA'),
    ('Union Bank of India', 'UNION'),
    ('IndusInd Bank', 'INDUS'),
    ('Yes Bank', 'YES'),
    ('IDFC FIRST Bank', 'IDFC'),
    ('Federal Bank', 'FEDERAL')
ON CONFLICT (code) DO NOTHING;

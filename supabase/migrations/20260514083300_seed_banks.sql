-- Seed banks
INSERT INTO banks (name, code)
VALUES ('ICICI Bank', 'ICICI'), ('HDFC Bank', 'HDFC'), ('Axis Bank', 'AXIS'), ('Kotak Bank', 'KOTAK')
ON CONFLICT (code) DO NOTHING;

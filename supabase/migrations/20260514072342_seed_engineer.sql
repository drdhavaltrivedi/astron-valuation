-- Seed a test Engineer user
INSERT INTO users (name, email, role)
VALUES ('Amit Sharma', 'engineer@astron.com', 'engineer')
ON CONFLICT (email) DO NOTHING;

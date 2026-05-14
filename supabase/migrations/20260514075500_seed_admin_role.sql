-- Seed a test Admin user
INSERT INTO users (name, email, role)
VALUES ('Operations Admin', 'admin_ops@astron.com', 'admin')
ON CONFLICT (email) DO NOTHING;

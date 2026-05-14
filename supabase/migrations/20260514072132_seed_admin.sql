-- Seed a test Admin user
INSERT INTO users (name, email, role)
VALUES ('Super Admin', 'admin@astron.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

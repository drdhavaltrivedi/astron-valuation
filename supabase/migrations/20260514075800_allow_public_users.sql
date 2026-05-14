-- Disable RLS for users table for demo purposes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Alternatively, add a policy if you want to keep RLS enabled
-- CREATE POLICY "Public Access" ON users FOR SELECT USING (true);

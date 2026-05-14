-- Seed 5 more field engineers
INSERT INTO users (name, email, role)
VALUES
('Het Patel', 'het.patel@astron.com', 'engineer'),
('Soham Prajapti', 'soham.p@astron.com', 'engineer'),
('Dinesh Kacchot', 'dinesh.k@astron.com', 'engineer'),
('Smit Kotadiya', 'smit.k@astron.com', 'engineer'),
('Naresh Rakholiya', 'naresh.r@astron.com', 'engineer')
ON CONFLICT (email) DO NOTHING;

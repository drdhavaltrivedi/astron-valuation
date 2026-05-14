-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supabase PostgreSQL DB Schema for Astron Valuation Platform

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'engineer')),
  zone_id UUID, -- Will reference zones.id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banks Table
CREATE TABLE banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zones Table
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode_list TEXT[] -- Array of pincodes
);

-- Add foreign key to users after zones table creation
ALTER TABLE users ADD CONSTRAINT fk_zone FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE SET NULL;

-- Cases Table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
  application_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT,
  property_type TEXT,
  product_type TEXT,
  assigned_engineer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'ALLOCATED', 'VISIT_STARTED', 'FORM_SUBMITTED', 'ADMIN_REVIEW', 'REPORT_GENERATED', 'SUBMITTED_TO_BANK', 'COMPLETED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visits Table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  engineer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  visit_started_at TIMESTAMPTZ,
  visit_completed_at TIMESTAMPTZ,
  gps_lat NUMERIC,
  gps_lng NUMERIC,
  google_map_link TEXT,
  ownership_type TEXT,
  locality_type TEXT,
  community TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Measurements Table
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  plot_area NUMERIC,
  builtup_area NUMERIC,
  carpet_area NUMERIC,
  carpet_rate NUMERIC,
  length NUMERIC,
  depth NUMERIC
);

-- Boundaries Table
CREATE TABLE boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  north TEXT,
  south TEXT,
  east TEXT,
  west TEXT
);

-- Landmarks Table
CREATE TABLE landmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  landmark TEXT NOT NULL,
  distance NUMERIC
);

-- Photos Table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('front', 'back', 'interior', 'road', 'surroundings')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sketches Table
CREATE TABLE sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL
);

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
  template_version TEXT,
  pdf_url TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing Entries Table
CREATE TABLE billing_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'paid')),
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update timestamp trigger for cases
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- PHASE 2: TICKETING & COMMUNICATION

-- Tickets Table for Internal Communication
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Comments
CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update timestamp trigger for tickets
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  searching_for TEXT NOT NULL,
  care_level TEXT NOT NULL,
  mobility_level TEXT NOT NULL,
  memory_care TEXT NOT NULL,
  medical_needs TEXT NOT NULL,
  price_range TEXT NOT NULL,
  timeline TEXT NOT NULL,
  source TEXT DEFAULT 'prelander',
  submitted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create an index on submitted_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads(submitted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to insert (for API)
-- Note: Service role bypasses RLS, so this is mainly for documentation
CREATE POLICY "Allow service role to insert leads"
  ON leads FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create a policy that allows authenticated users to read all leads
CREATE POLICY "Allow authenticated users to read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Create a policy for anonymous inserts (if you want public API access)
-- CREATE POLICY "Allow anonymous to insert leads"
--   ON leads FOR INSERT
--   TO anon
--   WITH CHECK (true);


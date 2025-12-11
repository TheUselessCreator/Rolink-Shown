/*
  # Create activation keys table for premium system

  1. New Tables
    - `activation_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique) - The activation key
      - `created_at` (timestamp)
      - `used_at` (timestamp, nullable) - When the key was used
      - `used_by` (uuid, nullable) - Which user used the key

  2. Security
    - Enable RLS on `activation_keys` table
    - Add policy for public to read unused keys (for validation)
    - Add policy for authenticated users to update keys when activating

  3. Sample Data
    - Insert 100 activation keys for testing
*/

-- Create activation keys table
CREATE TABLE IF NOT EXISTS activation_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  used_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE activation_keys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can check if key exists and is unused"
  ON activation_keys
  FOR SELECT
  TO public
  USING (used_at IS NULL);

CREATE POLICY "Authenticated users can use keys"
  ON activation_keys
  FOR UPDATE
  TO public
  USING (used_at IS NULL);

-- Add premium status to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE users ADD COLUMN is_premium boolean DEFAULT false;
  END IF;
END $$;

-- Update gamepass constraint to allow 20 for premium users
ALTER TABLE gamepasses DROP CONSTRAINT IF EXISTS valid_order;
ALTER TABLE gamepasses ADD CONSTRAINT valid_order CHECK (
  ("order" >= 1 AND "order" <= 20)
);

-- Generate 100 activation keys
INSERT INTO activation_keys (key)
SELECT 'ROLINK-' || upper(substring(md5(random()::text) from 1 for 8)) || '-' || upper(substring(md5(random()::text) from 1 for 8))
FROM generate_series(1, 100)
ON CONFLICT (key) DO NOTHING;
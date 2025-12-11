/*
  # Fix activation keys RLS policies

  1. Security Updates
    - Update RLS policies to allow proper key activation
    - Allow authenticated users to update unused keys
    - Maintain security while enabling functionality

  2. Changes
    - Fix SELECT policy to allow checking key validity
    - Fix UPDATE policy to allow key activation by authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can check if key exists and is unused" ON activation_keys;
DROP POLICY IF EXISTS "Authenticated users can use keys" ON activation_keys;

-- Create new policies that work properly
CREATE POLICY "Anyone can read unused keys"
  ON activation_keys
  FOR SELECT
  TO public
  USING (used_at IS NULL);

CREATE POLICY "Authenticated users can activate unused keys"
  ON activation_keys
  FOR UPDATE
  TO authenticated
  USING (used_at IS NULL)
  WITH CHECK (used_at IS NOT NULL AND used_by IS NOT NULL);
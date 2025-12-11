/*
  # Fix Activation Keys RLS Policy

  1. Security Updates
    - Drop existing conflicting policies
    - Create proper UPDATE policy for authenticated users
    - Allow users to activate unused keys
    - Ensure WITH CHECK allows the new row state after activation

  The key issue was that the WITH CHECK expression was preventing
  the update because it was checking the new state incorrectly.
*/

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Anyone can check if key exists and is unused" ON activation_keys;
DROP POLICY IF EXISTS "Anyone can read unused keys" ON activation_keys;
DROP POLICY IF EXISTS "Authenticated users can use keys" ON activation_keys;
DROP POLICY IF EXISTS "Users can activate unused keys" ON activation_keys;

-- Create proper SELECT policy for checking unused keys
CREATE POLICY "Anyone can read unused keys"
  ON activation_keys
  FOR SELECT
  TO public
  USING (used_at IS NULL);

-- Create proper UPDATE policy for activating keys
CREATE POLICY "Authenticated users can activate unused keys"
  ON activation_keys
  FOR UPDATE
  TO authenticated
  USING (used_at IS NULL)
  WITH CHECK (
    used_at IS NOT NULL 
    AND used_by = auth.uid()
  );
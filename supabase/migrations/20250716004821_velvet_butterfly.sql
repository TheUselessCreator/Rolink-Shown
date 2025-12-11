/*
  # Fix Activation Keys Update Policy

  1. Changes
    - Fix the UPDATE policy to properly allow key activation
    - Ensure users can mark keys as used

  2. Security
    - Allow authenticated users to update unused keys
    - Ensure proper validation of the update
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can activate unused keys" ON activation_keys;

-- Create new update policy that works correctly
CREATE POLICY "Users can activate unused keys"
  ON activation_keys
  FOR UPDATE
  TO authenticated
  USING (used_at IS NULL)
  WITH CHECK (used_at IS NOT NULL AND used_by IS NOT NULL);
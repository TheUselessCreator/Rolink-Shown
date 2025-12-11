/*
  # Add tier column to users table

  1. Changes
    - Add `tier` column to `users` table with default value 'free'
    - Add check constraint to ensure only valid tier values
    - Update existing users to have 'free' tier by default
    - Convert existing `is_premium` users to 'premium' tier if column exists

  2. Security
    - No RLS changes needed, existing policies will work with new column
*/

-- Add the tier column with default value
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier text DEFAULT 'free';

-- Add check constraint to ensure only valid tier values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_tier_check' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_tier_check 
    CHECK (tier IN ('free', 'supporter', 'premium'));
  END IF;
END $$;

-- Update existing users to have proper tier values
UPDATE users SET tier = 'free' WHERE tier IS NULL;

-- If is_premium column exists, convert premium users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    UPDATE users SET tier = 'premium' WHERE is_premium = true;
  END IF;
END $$;
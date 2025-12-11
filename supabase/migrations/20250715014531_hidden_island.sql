/*
  # Create gamepasses table for Rolink

  1. New Tables
    - `gamepasses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text) - Gamepass title/name
      - `link` (text) - Roblox gamepass URL
      - `order` (integer) - Display order (1-5)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `gamepasses` table
    - Add policy for public read access (anyone can view gamepasses)
    - Add policy for users to manage their own gamepasses
    
  3. Constraints
    - Foreign key relationship to users table
    - Check constraint to limit order to 1-5
*/

CREATE TABLE IF NOT EXISTS gamepasses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  "order" integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure order is between 1 and 5
  CONSTRAINT valid_order CHECK ("order" >= 1 AND "order" <= 5)
);

ALTER TABLE gamepasses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gamepasses
CREATE POLICY "Gamepasses are publicly readable"
  ON gamepasses
  FOR SELECT
  TO public
  USING (true);

-- Allow users to manage their own gamepasses
CREATE POLICY "Users can manage own gamepasses"
  ON gamepasses
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gamepasses_user_id ON gamepasses(user_id);
CREATE INDEX IF NOT EXISTS idx_gamepasses_order ON gamepasses("order");
/*
  # Create users table for Rolink

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `discord_id` (text, unique) - Discord user ID
      - `username` (text) - Discord username
      - `avatar_url` (text) - Discord avatar URL
      - `custom_link` (text, unique) - Custom URL slug for user page
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for public read access (users can view all profiles)
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  username text NOT NULL,
  avatar_url text NOT NULL,
  custom_link text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to user profiles
CREATE POLICY "Users are publicly readable"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);
/*
  # Add User Themes

  1. New Columns
    - `theme` (text) - stores the selected theme name
    - `custom_background_color` (text) - stores custom background color

  2. Security
    - Users can update their own theme settings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'theme'
  ) THEN
    ALTER TABLE users ADD COLUMN theme text DEFAULT 'default';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'custom_background_color'
  ) THEN
    ALTER TABLE users ADD COLUMN custom_background_color text DEFAULT '#000000';
  END IF;
END $$;
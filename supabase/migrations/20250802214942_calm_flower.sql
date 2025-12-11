/*
  # Add user description and rating system

  1. New Columns
    - `users.description` (text) - User's personal description
    - `users.rating_average` (numeric) - Average rating score
    - `users.rating_count` (integer) - Total number of ratings

  2. New Tables
    - `user_ratings` - Store individual ratings from users
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User being rated
      - `rater_id` (uuid) - User giving the rating
      - `rating` (integer) - Rating value (1-5)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on `user_ratings` table
    - Add policies for rating management
    - Prevent users from rating themselves
    - Allow one rating per user pair
*/

-- Add description and rating fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'description'
  ) THEN
    ALTER TABLE users ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'rating_average'
  ) THEN
    ALTER TABLE users ADD COLUMN rating_average numeric(3,2) DEFAULT 0.00;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'rating_count'
  ) THEN
    ALTER TABLE users ADD COLUMN rating_count integer DEFAULT 0;
  END IF;
END $$;

-- Create user_ratings table
CREATE TABLE IF NOT EXISTS user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, rater_id)
);

-- Enable RLS
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_ratings
CREATE POLICY "Anyone can read ratings"
  ON user_ratings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can rate others"
  ON user_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_id AND 
    auth.uid() != user_id
  );

CREATE POLICY "Users can update their own ratings"
  ON user_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = rater_id)
  WITH CHECK (auth.uid() = rater_id);

-- Create function to update user rating average
CREATE OR REPLACE FUNCTION update_user_rating_average()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's rating average and count
  UPDATE users 
  SET 
    rating_average = (
      SELECT COALESCE(AVG(rating), 0)
      FROM user_ratings 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM user_ratings 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update rating averages
DROP TRIGGER IF EXISTS update_rating_average_on_insert ON user_ratings;
CREATE TRIGGER update_rating_average_on_insert
  AFTER INSERT ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating_average();

DROP TRIGGER IF EXISTS update_rating_average_on_update ON user_ratings;
CREATE TRIGGER update_rating_average_on_update
  AFTER UPDATE ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating_average();

DROP TRIGGER IF EXISTS update_rating_average_on_delete ON user_ratings;
CREATE TRIGGER update_rating_average_on_delete
  AFTER DELETE ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating_average();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rater_id ON user_ratings(rater_id);
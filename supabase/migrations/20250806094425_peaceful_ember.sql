/*
  # Add username field to profiles table

  1. Changes
    - Add `username` column to `profiles` table
    - Add unique constraint on username
    - Add index for faster lookups
    - Update existing profiles with generated usernames based on names

  2. Security
    - Maintain existing RLS policies
*/

-- Add username column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
  END IF;
END $$;

-- Create unique index on username
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'profiles' AND indexname = 'profiles_username_unique'
  ) THEN
    CREATE UNIQUE INDEX profiles_username_unique ON profiles(username) WHERE username IS NOT NULL;
  END IF;
END $$;

-- Update existing profiles with generated usernames
UPDATE profiles 
SET username = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', '')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE username IS NULL;

-- Add constraint to ensure username is unique and not null for new records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_username_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_check CHECK (username IS NOT NULL AND LENGTH(username) >= 3);
  END IF;
END $$;
/*
  # Create profiles management schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `tagline` (text)
      - `bio` (text)
      - `profile_image` (text, URL)
      - `cover_image` (text, URL)
      - `location_address` (text)
      - `location_city` (text)
      - `location_country` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `social_links`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `platform` (text)
      - `url` (text)
      - `username` (text)
    - `services`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `price` (text)
    - `business_hours`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `day` (text)
      - `hours` (text)
      - `is_open` (boolean)
    - `gallery_images`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `image_url` (text)
      - `order_index` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage profiles
    - Add storage bucket for profile images

  3. Storage
    - Create storage bucket for profile images
    - Set up policies for image upload/delete
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text DEFAULT '',
  bio text DEFAULT '',
  profile_image text DEFAULT '',
  cover_image text DEFAULT '',
  location_address text DEFAULT '',
  location_city text DEFAULT '',
  location_country text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  username text DEFAULT ''
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price text DEFAULT ''
);

-- Create business_hours table
CREATE TABLE IF NOT EXISTS business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  day text NOT NULL,
  hours text NOT NULL,
  is_open boolean DEFAULT true
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  order_index integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for social_links
CREATE POLICY "Anyone can read social_links"
  ON social_links
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage social_links"
  ON social_links
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for services
CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for business_hours
CREATE POLICY "Anyone can read business_hours"
  ON business_hours
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage business_hours"
  ON business_hours
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for gallery_images
CREATE POLICY "Anyone can read gallery_images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage gallery_images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view profile images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can update profile images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can delete profile images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-images');
/*
  # Initial Schema for Student Housing App

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text, optional)
      - `user_type` (enum: student, landlord)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)

    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (enum: rent, sale)
      - `price` (integer)
      - `city` (text)
      - `neighborhood` (text)
      - `street_name` (text)
      - `house_name` (text, optional)
      - `amenities` (text array)
      - `nearby_landmarks` (text array)
      - `images` (text array)
      - `landlord_id` (uuid, foreign key)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area_sqm` (integer, optional)
      - `is_available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `chats`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `landlord_id` (uuid, foreign key)
      - `last_message` (text, optional)
      - `last_message_at` (timestamp, optional)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key)
      - `receiver_id` (uuid, foreign key)
      - `content` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for property visibility and chat access
*/

-- Create enum types
CREATE TYPE user_type_enum AS ENUM ('student', 'landlord');
CREATE TYPE property_type_enum AS ENUM ('rent', 'sale');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  user_type user_type_enum NOT NULL DEFAULT 'student',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type property_type_enum NOT NULL,
  price integer NOT NULL,
  city text NOT NULL,
  neighborhood text NOT NULL,
  street_name text NOT NULL,
  house_name text,
  amenities text[] DEFAULT '{}',
  nearby_landmarks text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  landlord_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  area_sqm integer,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, student_id, landlord_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can read available properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Landlords can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = landlord_id);

-- Chats policies
CREATE POLICY "Users can read own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = landlord_id);

CREATE POLICY "Users can create chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id OR auth.uid() = landlord_id);

CREATE POLICY "Users can update own chats"
  ON chats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = landlord_id);

-- Messages policies
CREATE POLICY "Users can read messages in their chats"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.student_id = auth.uid() OR chats.landlord_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their chats"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.student_id = auth.uid() OR chats.landlord_id = auth.uid())
    )
  );

CREATE POLICY "Users can update messages they received"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(is_available);
CREATE INDEX IF NOT EXISTS idx_chats_student ON chats(student_id);
CREATE INDEX IF NOT EXISTS idx_chats_landlord ON chats(landlord_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for properties updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
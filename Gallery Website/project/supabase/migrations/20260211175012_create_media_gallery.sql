/*
  # Create Media Gallery Schema

  1. New Tables
    - `media`
      - `id` (uuid, primary key) - Unique identifier for each media item
      - `title` (text) - Title/name of the media
      - `description` (text, optional) - Description of the media
      - `file_path` (text) - Path to the file in storage
      - `file_type` (text) - Type of file (image or video)
      - `file_size` (integer) - Size of file in bytes
      - `thumbnail_url` (text, optional) - URL to thumbnail
      - `created_at` (timestamptz) - When the media was uploaded
      - `user_id` (uuid) - Owner of the media item

  2. Security
    - Enable RLS on `media` table
    - Add policy for users to view their own media
    - Add policy for users to insert their own media
    - Add policy for users to delete their own media
    - Add policy for users to update their own media

  3. Storage
    - Create storage bucket for media files
    - Enable public access for viewing
    - Set up RLS policies for storage
*/

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer DEFAULT 0,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own media"
  ON media FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON media FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON media FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS media_user_id_idx ON media(user_id);
CREATE INDEX IF NOT EXISTS media_created_at_idx ON media(created_at DESC);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view all media files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Users can delete their own media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
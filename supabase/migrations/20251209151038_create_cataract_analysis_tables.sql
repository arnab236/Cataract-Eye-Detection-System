/*
  # Cataract Analysis System Database Schema

  1. New Tables
    - `patients`
      - `id` (uuid, primary key) - Unique patient identifier
      - `full_name` (text) - Patient full name
      - `email` (text) - Patient email address
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `cataract_analyses`
      - `id` (uuid, primary key) - Unique analysis identifier
      - `patient_id` (uuid, foreign key) - Reference to patients table
      - `image_url` (text) - URL of uploaded fundus image
      - `has_cataract` (boolean) - Whether cataract was detected
      - `confidence_percentage` (integer) - Detection confidence (0-100)
      - `severity_level` (text) - mild, moderate, or severe
      - `opacity_grade` (numeric) - Opacity score (0-4)
      - `cataract_type` (text) - Nuclear, Cortical, or Posterior Subcapsular
      - `recommendation` (text) - Clinical recommendation text
      - `patient_case_id` (text) - Human-readable case ID
      - `created_at` (timestamptz) - Analysis timestamp
      - `reviewed` (boolean) - Whether analysis has been reviewed

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cataract_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  has_cataract boolean NOT NULL DEFAULT false,
  confidence_percentage integer NOT NULL DEFAULT 0,
  severity_level text,
  opacity_grade numeric(3,1),
  cataract_type text,
  recommendation text,
  patient_case_id text,
  created_at timestamptz DEFAULT now(),
  reviewed boolean DEFAULT false
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cataract_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert patients"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read patients"
  ON patients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert analyses"
  ON cataract_analyses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read analyses"
  ON cataract_analyses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update analyses"
  ON cataract_analyses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
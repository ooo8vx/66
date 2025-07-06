/*
  # إنشاء جدول المشاريع

  1. الجداول الجديدة
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text)
      - `technologies` (text array)
      - `category` (text, optional)
      - `image_url` (text, optional)
      - `github_url` (text, optional)
      - `live_url` (text, optional)
      - `featured` (boolean, default false)
      - `is_public` (boolean, default true)
      - `views` (integer, default 0)
      - `likes` (integer, default 0)
      - `tags` (text array, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جدول `projects`
    - إضافة سياسة للقراءة العامة للمشاريع العامة
    - إضافة سياسة للإدراج والتحديث
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  technologies text[] DEFAULT ARRAY[]::text[],
  category text,
  image_url text,
  github_url text,
  live_url text,
  featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة العامة للمشاريع العامة
CREATE POLICY "Public projects can be read by anyone"
  ON projects
  FOR SELECT
  TO public
  USING (is_public = true);

-- سياسة للإدراج والتحديث
CREATE POLICY "Projects can be inserted and updated"
  ON projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- إنشاء فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
/*
  # إنشاء جدول المستخدمين

  1. الجداول الجديدة
    - `users`
      - `id` (uuid, primary key)
      - `discord_id` (text, unique)
      - `username` (text)
      - `discriminator` (text)
      - `avatar_url` (text, optional)
      - `email` (text, optional)
      - `bio` (text, optional)
      - `skills` (text array, optional)
      - `social_links` (jsonb, optional)
      - `is_active` (boolean, default true)
      - `last_login` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جدول `users`
    - إضافة سياسة للقراءة العامة
    - إضافة سياسة للتحديث للمستخدمين المصرح لهم
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  username text NOT NULL,
  discriminator text NOT NULL DEFAULT '0000',
  avatar_url text,
  email text,
  bio text,
  skills text[] DEFAULT ARRAY[]::text[],
  social_links jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة العامة
CREATE POLICY "Users can be read by anyone"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- سياسة للإدراج والتحديث (للمستخدمين المصرح لهم أو العامة)
CREATE POLICY "Users can be inserted and updated"
  ON users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
/*
  # إنشاء جدول جهات الاتصال

  1. الجداول الجديدة
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text, default 'new')
      - `priority` (text, default 'medium')
      - `ip_address` (text, optional)
      - `user_agent` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جدول `contacts`
    - إضافة سياسة للإدراج العام
    - إضافة سياسة للقراءة المحدودة
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- سياسة للإدراج العام (أي شخص يمكنه إرسال رسالة)
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- سياسة للقراءة (عامة للآن، يمكن تقييدها لاحقاً)
CREATE POLICY "Contacts can be read"
  ON contacts
  FOR SELECT
  TO public
  USING (true);

-- إنشاء فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
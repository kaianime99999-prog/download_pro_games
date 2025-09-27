# إعداد قاعدة البيانات

## 1. إنشاء حساب Supabase (مجاني)
- اذهب إلى https://supabase.com
- سجل حساب جديد
- أنشئ مشروع جديد

## 2. إنشاء جدول الألعاب
في SQL Editor في Supabase، نفذ:

```sql
-- إنشاء جدول الألعاب
CREATE TABLE games (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  downloadLink TEXT NOT NULL,
  category TEXT NOT NULL,
  platforms TEXT,
  systemReqs TEXT,
  gameSpecs TEXT,
  views INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- دالة زيادة المشاهدات
CREATE OR REPLACE FUNCTION increment_views(game_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE games SET views = views + 1 WHERE id = game_id;
END;
$$ LANGUAGE plpgsql;

-- إدراج بيانات تجريبية
INSERT INTO games (title, description, imageUrl, downloadLink, category, platforms, systemReqs, gameSpecs) VALUES
('Call of Duty: Modern Warfare', 'لعبة إطلاق نار من منظور الشخص الأول', '/icon.jpg', 'https://example.com/cod', 'ACTION', 'Windows, PlayStation, Xbox', 'Windows 10, 8GB RAM', 'حجم اللعبة: 175GB'),
('FIFA 2024', 'أحدث إصدار من سلسلة فيفا', '/icon.jpg', 'https://example.com/fifa', 'FOOTBALL', 'Windows, PlayStation, Xbox', 'Windows 10, 4GB RAM', 'حجم اللعبة: 50GB');
```

## 3. إعداد المتغيرات
- انسخ URL و API Key من إعدادات المشروع
- أضفهم في `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

## 4. تثبيت المكتبة
```bash
npm install @supabase/supabase-js
```

## 5. النشر على Vercel
أضف نفس المتغيرات في إعدادات Vercel.
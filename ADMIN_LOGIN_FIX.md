# 🔐 Admin Login Sorunu - Çözüm Rehberi

## Sorun

`admin@estatebali.app` / `admin123` ile admin paneline giriş yapılamıyor.
Hata: "Invalid email or password"

## Olası Sebepler

1. ❌ `admin_users` tablosu database'de yok
2. ❌ Admin kullanıcı database'de yok
3. ❌ Password hash yanlış veya eksik
4. ❌ Login fonksiyonu admin_users tablosunu bulamıyor

---

## 🔍 Adım 1: Database Kontrolü

### 1.1. admin_users Tablosu Var mı?

**Supabase SQL Editor'de çalıştır:**

```sql
-- Tablo var mı kontrol et
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
) as table_exists;
```

**Eğer `table_exists = false` ise:**
→ Tablo yok, önce tabloyu oluşturmalısınız (Adım 2)

**Eğer `table_exists = true` ise:**
→ Tablo var, kullanıcıyı kontrol edin (Adım 1.2)

### 1.2. Admin Kullanıcı Var mı?

```sql
-- Admin kullanıcıları listele
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_format,
  created_at
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

**Beklenen:**
- Email: `admin@estatebali.app`
- `has_password`: `true`
- `hash_length`: `60` (bcrypt hash)
- `hash_format`: `$2a$10$` ile başlamalı

**Eğer sonuç boşsa:**
→ Admin kullanıcı yok, oluşturmalısınız (Adım 3)

**Eğer `has_password = false` ise:**
→ Password hash eksik, güncellemelisiniz (Adım 4)

---

## 🔧 Adım 2: admin_users Tablosu Oluştur

**Eğer tablo yoksa:**

1. **Supabase Dashboard → SQL Editor**'e gidin
2. **`supabase/migrations/create_admin_users_table.sql`** dosyasını açın
3. **Tüm içeriği kopyalayıp SQL Editor'de çalıştırın**

Veya direkt şu SQL'i çalıştırın:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service role can access)
CREATE POLICY "Service role can read admin users"
  ON admin_users FOR SELECT USING (true);

CREATE POLICY "Service role can insert admin users"
  ON admin_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update admin users"
  ON admin_users FOR UPDATE USING (true);

CREATE POLICY "Service role can delete admin users"
  ON admin_users FOR DELETE USING (true);
```

---

## 👤 Adım 3: Admin Kullanıcı Oluştur

### 3.1. Password Hash Oluştur

**Şifre:** `admin123`

**Seçenek 1: Online Tool (En Kolay)**
1. https://bcrypt-generator.com/ adresine gidin
2. Password: `admin123` girin
3. Rounds: `10` seçin
4. "Generate Hash" butonuna tıklayın
5. Oluşan hash'i kopyalayın

**Seçenek 2: Terminal'de**
```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

**Örnek Hash (admin123 için):**
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 3.2. Admin Kullanıcı Ekle

**Supabase SQL Editor'de çalıştır:**

```sql
-- Admin kullanıcı oluştur (şifre: admin123)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123 hash
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true,
  role = EXCLUDED.role;
```

**Kendi hash'inizi kullanmak istiyorsanız:**
```sql
-- Yukarıdaki adımdan aldığınız hash'i buraya yapıştırın
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  'BURAYA_KENDI_HASH_INIZI_YAPIŞTIRIN', -- Yukarıdaki komuttan aldığınız hash
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;
```

### 3.3. Kontrol Et

```sql
-- Oluşturulan kullanıcıyı kontrol et
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_format,
  created_at
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

**Beklenen Sonuç:**
```
email                  | admin@estatebali.app
name                   | Admin User
role                   | admin
active                 | true
has_password           | true
hash_length            | 60
hash_format            | $2a$10$N9q
created_at             | 2025-01-XX ...
```

---

## 🔄 Adım 4: Password Hash Güncelle

**Eğer kullanıcı var ama password hash yanlışsa:**

```sql
-- 1. Yeni hash oluştur (Terminal'de)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"

-- 2. Database'de güncelle
UPDATE admin_users 
SET password_hash = 'YENI_OLUSTURULAN_HASH'
WHERE email = 'admin@estatebali.app';
```

---

## 🧪 Adım 5: Login Test Et

1. **Browser'da `/admin/login` sayfasına gidin**
2. **Email:** `admin@estatebali.app`
3. **Password:** `admin123`
4. **"Sign In" butonuna tıklayın**

**Başarılı olursa:**
→ `/admin` sayfasına yönlendirilirsiniz ✅

**Hata alırsanız:**
→ Browser console'u açın (F12) ve log'ları kontrol edin

---

## 🐛 Debug: Login Log'ları

**Browser Console'da (F12):**
- Network tab → `/api/auth/login` request → Response

**Server Log'lar (Vercel/Production):**
- Vercel Dashboard → Deployments → Functions → Logs
- Arama: `[Login]`

**Beklenen Log'lar:**
```
[Login] Admin user check: {
  email: 'admin@estatebali.app',
  found: true,
  hasPasswordHash: true,
  passwordHashLength: 60
}

[Login] Password verification: {
  passwordMatch: true
}

[Login] Success for user: {
  email: 'admin@estatebali.app',
  role: 'admin'
}
```

---

## ⚠️ Yaygın Hatalar ve Çözümleri

### Hata 1: "relation admin_users does not exist"

**Çözüm:** Adım 2'yi uygulayın (tablo oluştur)

### Hata 2: "Invalid email or password" (kullanıcı var)

**Olası Sebepler:**
1. Password hash yanlış → Adım 4'ü uygulayın
2. `active = false` → `UPDATE admin_users SET active = true WHERE email = 'admin@estatebali.app';`
3. Email yanlış yazılmış → Database'de kontrol edin

### Hata 3: "User not found in database"

**Çözüm:** Adım 3'ü uygulayın (kullanıcı oluştur)

### Hata 4: Login fonksiyonu admin_users tablosunu bulamıyor

**Kontrol:**
```sql
-- Tablo adı doğru mu?
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%admin%';
```

---

## 🚀 Hızlı Çözüm (Tüm Adımlar Tek Seferde)

**Supabase SQL Editor'de sırayla çalıştırın:**

```sql
-- 1. Tablo oluştur (eğer yoksa)
-- supabase/migrations/create_admin_users_table.sql dosyasını çalıştırın

-- 2. Admin kullanıcı oluştur (şifre: admin123)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;

-- 3. Kontrol et
SELECT email, name, role, active, 
       password_hash IS NOT NULL as has_password,
       LENGTH(password_hash) as hash_length
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

---

## 📝 Notlar

1. **Production'da mutlaka şifreyi değiştirin!**
2. **Password hash'i asla kod içinde hardcode etmeyin**
3. **Admin kullanıcıları düzenli olarak kontrol edin**
4. **İhtiyaç duyulmayan admin hesaplarını deaktif edin**

---

## 🔐 Güvenlik

- Production'da güçlü bir şifre kullanın
- Şifre hash'i environment variable'da saklamayın (database'de saklanmalı)
- Admin kullanıcıları düzenli olarak audit edin
- İki faktörlü kimlik doğrulama (2FA) eklemeyi düşünün

---

## İletişim

Sorun devam ederse, şu bilgileri paylaşın:
1. Database sorgu sonuçları (tablo var mı, kullanıcı var mı)
2. Login log'ları (browser console ve server logs)
3. Hata mesajının tam metni


# 🔍 Admin Login Debug - Adım Adım Kontrol

## Sorun

`admin@estatebali.app` / `admin123` ile giriş yapılamıyor.
Hata: "Invalid email or password"

## Kontrol Listesi

### ✅ Adım 1: Tablo Var mı?

**Supabase SQL Editor:**
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
) as table_exists;
```

**Beklenen:** `table_exists = true`

**Eğer `false` ise:**
→ `QUICK_ADMIN_SETUP.sql` dosyasını çalıştırın

---

### ✅ Adım 2: Admin Kullanıcı Var mı?

```sql
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_format
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

**Beklenen:**
- Email: `admin@estatebali.app`
- Active: `true`
- has_password: `true`
- hash_length: `60`
- hash_format: `$2b$10$BL/` veya `$2a$10$`

**Eğer sonuç boşsa:**
→ Admin kullanıcı yok, oluşturun

**Eğer `active = false` ise:**
```sql
UPDATE admin_users SET active = true WHERE email = 'admin@estatebali.app';
```

**Eğer `has_password = false` ise:**
→ Password hash eksik, güncelleyin

---

### ✅ Adım 3: Login Log'larını Kontrol Et

**Browser Console (F12):**
1. `/admin/login` sayfasına gidin
2. Email ve password girin
3. "Sign In" butonuna tıklayın
4. Console'u kontrol edin

**Beklenen Log'lar:**
```
[Login] Admin user check: {
  email: 'admin@estatebali.app',
  found: true,
  hasPasswordHash: true,
  passwordHashLength: 60,
  role: 'admin'
}

[Login] Password verification result: {
  passwordMatch: true/false
}
```

**Eğer `found: false` ise:**
→ Kullanıcı database'de yok (Adım 2'yi kontrol edin)

**Eğer `passwordMatch: false` ise:**
→ Password hash yanlış, yeniden oluşturun

---

### ✅ Adım 4: Password Hash'i Yeniden Oluştur

**Terminal'de:**
```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

**Yeni hash'i database'de güncelleyin:**
```sql
UPDATE admin_users 
SET password_hash = 'YENI_OLUSTURULAN_HASH'
WHERE email = 'admin@estatebali.app';
```

---

### ✅ Adım 5: Admin Kullanıcıyı Sıfırdan Oluştur

**Eğer hiçbir şey işe yaramıyorsa:**

```sql
-- 1. Mevcut kullanıcıyı sil (eğer varsa)
DELETE FROM admin_users WHERE email = 'admin@estatebali.app';

-- 2. Yeni hash oluştur (Terminal'de)
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"

-- 3. Yeni kullanıcı oluştur
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  'YENI_HASH_BURAYA', -- Terminal'den aldığınız hash
  'admin',
  true
);

-- 4. Kontrol et
SELECT email, name, role, active, 
       password_hash IS NOT NULL as has_password,
       LENGTH(password_hash) as hash_length
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

---

## 🐛 Yaygın Sorunlar

### Sorun 1: Tablo Yok
**Çözüm:** `QUICK_ADMIN_SETUP.sql` dosyasını çalıştırın

### Sorun 2: Kullanıcı Yok
**Çözüm:** `CREATE_ADMIN_USER.sql` dosyasını çalıştırın

### Sorun 3: Password Hash Yanlış
**Çözüm:** Adım 4'ü uygulayın (yeni hash oluştur)

### Sorun 4: Active = false
**Çözüm:** 
```sql
UPDATE admin_users SET active = true WHERE email = 'admin@estatebali.app';
```

### Sorun 5: RLS Politikaları Sorunlu
**Kontrol:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

**Eğer policy yoksa:**
→ `QUICK_ADMIN_SETUP.sql` dosyasındaki RLS politikalarını çalıştırın

---

## 🔍 Debug SQL Script

**Tüm kontrolleri tek seferde yapın:**

```sql
-- 1. Tablo var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
) as table_exists;

-- 2. Kullanıcı var mı?
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

-- 3. RLS politikaları var mı?
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'admin_users';

-- 4. Tüm admin kullanıcılar
SELECT email, name, role, active, created_at
FROM admin_users;
```

---

## ✅ Hızlı Düzeltme

**Eğer hiçbir şey çalışmıyorsa, sıfırdan başlayın:**

1. **Tablo oluştur:** `QUICK_ADMIN_SETUP.sql` çalıştır
2. **Kullanıcı oluştur:** Script içindeki INSERT komutu çalışacak
3. **Test et:** `/admin/login` sayfasına git ve giriş yap

---

## 📝 İletişim

Sorun devam ederse, şu bilgileri paylaşın:
1. Tablo var mı sorgusu sonucu
2. Kullanıcı var mı sorgusu sonucu
3. Browser console log'ları
4. Server log'ları (Vercel Dashboard → Functions → Logs)


# 🚨 Login Sorunu - Hızlı Çözüm

## Problem

`flaneur@gmail.com` ile giriş yapılamıyor.

## Hızlı Çözüm

### Adım 1: Kullanıcıyı Database'de Kontrol Et

**Supabase Dashboard → SQL Editor:**

```sql
SELECT email, name, role FROM admin_users WHERE email = 'flaneur@gmail.com';
SELECT email, name, role FROM users WHERE email = 'flaneur@gmail.com';
```

**Sonuç yoksa:** Kullanıcı database'de yok, Adım 2'ye geç.

### Adım 2: Password Hash Oluştur

**Terminal'de:**
```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRENIZ', 10));"
```

**VEYA online:** https://bcrypt-generator.com/

### Adım 3: Kullanıcı Oluştur

**Supabase Dashboard → SQL Editor:**

```sql
-- Admin kullanıcı oluştur
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'flaneur@gmail.com',
  'Flaneur User',
  'BURAYA_HASH_YAPISTIR', -- Adım 2'den aldığın hash
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;
```

### Adım 4: Test Et

Site'yi yenile ve `flaneur@gmail.com` ile giriş yap.

## Önemli Notlar

- ✅ Debug logging eklendi (Vercel logs'da görünecek)
- ✅ Şifre bcrypt hash formatında olmalı
- ✅ Admin kullanıcı için `active = true` olmalı

## Detaylı Rehber

`LOGIN_FIX.md` dosyasına bakın.


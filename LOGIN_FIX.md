# 🔐 Login Sorunu - Çözüm Rehberi

## Problem

`flaneur@gmail.com` ile giriş yapılamıyor - "Invalid email or password" hatası alınıyor.

## Olası Sebepler

### 1. Database'de Kullanıcı Yok ✅ EN MUHTEMEL

Email database'de (`admin_users` veya `users` tablosunda) yok.

### 2. Password Hash Sorunu

- Password hash yanlış oluşturulmuş
- Bcrypt hash formatı yanlış
- Password hash database'de yok

### 3. Environment Variables Eksik

- JWT_SECRET (bu zaten düzeltildi)
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_URL

## Çözüm Adımları

### Adım 1: Database'de Kullanıcıyı Kontrol Et

Supabase Dashboard → SQL Editor:

```sql
-- Admin users'da kontrol et
SELECT email, name, role, active, created_at 
FROM admin_users 
WHERE email = 'flaneur@gmail.com';

-- Users tablosunda kontrol et
SELECT email, name, role, verified, created_at 
FROM users 
WHERE email = 'flaneur@gmail.com';
```

**Eğer hiçbir sonuç yoksa:** Kullanıcı oluşturulmamış, Adım 2'ye geç.

### Adım 2: Kullanıcı Oluştur

#### Seçenek A: Admin Kullanıcı Oluştur

```sql
-- Önce password hash oluştur (terminal'de):
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRENIZ_BURAYA', 10));"
-- Veya online: https://bcrypt-generator.com/

-- Sonra SQL'i çalıştır (PASSWORD_HASH'i değiştir):
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'flaneur@gmail.com',
  'Flaneur User',
  'PASSWORD_HASH_BURAYA', -- Bcrypt hash buraya
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;
```

#### Seçenek B: Normal Kullanıcı Oluştur

```sql
INSERT INTO users (email, name, password_hash, role, verified)
VALUES (
  'flaneur@gmail.com',
  'Flaneur User',
  'PASSWORD_HASH_BURAYA', -- Bcrypt hash buraya
  'customer',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  verified = true;
```

### Adım 3: Password Hash Oluşturma

#### Yöntem 1: Node.js ile (Terminal'de)

```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRENIZ_BURAYA', 10));"
```

#### Yöntem 2: Online Tool

1. https://bcrypt-generator.com/ adresine git
2. Şifrenizi gir
3. Rounds: 10 seç
4. Generate butonuna tıkla
5. Hash'i kopyala

### Adım 4: Test Et

1. Site'yi yenile
2. `flaneur@gmail.com` ve şifrenizle giriş yapmayı deneyin
3. Hala çalışmıyorsa Vercel logs'u kontrol edin

### Adım 5: Vercel Logs Kontrolü (Hala Çalışmıyorsa)

Vercel Dashboard → Deployments → Latest → Functions → Logs

Login denemesinde ne görünüyor kontrol edin. Development mode'da console.log'lar görünecek.

## Hızlı Test Script

Supabase SQL Editor'de çalıştır:

```sql
-- Mevcut kullanıcıları listele
SELECT 'admin_users' as table_name, email, name, role, active 
FROM admin_users 
WHERE email LIKE '%flaneur%' OR email LIKE '%@%'
UNION ALL
SELECT 'users' as table_name, email, name, role::text, verified::boolean as active
FROM users 
WHERE email LIKE '%flaneur%' OR email LIKE '%@%';
```

## Notlar

- ✅ Debug logging eklendi (development mode'da)
- ✅ Login fonksiyonu hem admin_users hem users tablosunu kontrol ediyor
- ✅ Password hash bcrypt formatında olmalı
- ✅ Admin kullanıcı için `active = true` olmalı
- ✅ Normal kullanıcı için `verified = true` olabilir

## İletişim

Sorun devam ederse:
1. Vercel logs'u paylaş
2. Supabase SQL Editor'deki sorgu sonuçlarını paylaş
3. Hangi şifreyle denediğinizi belirtin (şifreyi değil, hash'in doğru olup olmadığını kontrol edebilmek için)


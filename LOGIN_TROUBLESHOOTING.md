# 🔍 Login Troubleshooting Guide

## Problem
"Invalid email or password" hatası alınıyor ve hiçbir hesapla giriş yapılamıyor.

## Debug Adımları

### 1. Browser Console'u Kontrol Et

1. Browser'da F12'ye bas
2. Network tab'ına git
3. Login sayfasında giriş yapmayı dene
4. `/api/auth/login` request'ini bul ve kontrol et:
   - Request Payload: Email ve password doğru mu?
   - Response: Ne dönüyor?
   - Status Code: 200 mü, yoksa 400/500 mü?

### 2. Server Logs'u Kontrol Et

Vercel Dashboard'dan veya terminal'den:
- `/api/auth/login` endpoint'inin loglarını kontrol et
- `[Login]` ile başlayan logları ara

### 3. Database'deki Kullanıcıları Kontrol Et

Supabase SQL Editor'de şu sorguları çalıştır:

```sql
-- Admin users'ı kontrol et
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- Regular users'ı kontrol et
SELECT 
  email,
  name,
  role,
  verified,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

### 4. Password Hash Test

Eğer password hash'in doğru olup olmadığını test etmek istersen:

```sql
-- Test için bcrypt hash'i oluştur (Node.js'te)
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('test123', 10).then(h => console.log(h));"

-- Hash'i buraya yapıştır ve test et
SELECT 
  '$2b$10$...' = crypt('test123', '$2b$10$...') as password_match;
```

### 5. Environment Variables Kontrol

Vercel'de veya `.env.local`'de şunların olduğundan emin ol:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

### 6. Yeni Kullanıcı Oluştur

Eğer hiç kullanıcı yoksa veya password hash'leri yanlışsa, yeni kullanıcı oluştur:

```sql
-- Admin user oluştur (password: admin123)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2b$10$BL/WfWT7VDFO4zbCPfBbhOT5a41MnnXUHfU72uoG2yB7fgYmUlwi2',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;
```

## Hızlı Test: API Route'u Manuel Test Et

Terminal'de:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@estatebali.app","password":"admin123"}'
```

Veya production'da:
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@estatebali.app","password":"admin123"}'
```

## Yaygın Sorunlar ve Çözümleri

### 1. Email Case Sensitivity
- Email'ler case-sensitive olabilir
- Database'de email'i lowercase'e çevir: `LOWER(email)`

### 2. Password Hash Formatı
- Hash'ler bcrypt formatında olmalı: `$2b$10$...`
- Eğer hash formatı yanlışsa, yeni hash oluştur

### 3. RLS Policies
- Admin users tablosunda RLS kapalı olmalı
- Users tablosunda RLS politikaları service role key ile bypass edilmeli

### 4. Rate Limiting
- Çok fazla deneme yaptıysan rate limit'e takılmış olabilir
- 15 dakika bekle veya Redis'i temizle


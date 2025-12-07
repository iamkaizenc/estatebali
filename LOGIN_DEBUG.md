# 🔍 Login Debug Guide

## Problem

Email ve şifre doğru ama "Invalid email or password" hatası alınıyor.

## Olası Sebepler

### 1. Database'de Kullanıcı Yok
- `flaneur@gmail.com` admin_users veya users tablosunda yok
- Kullanıcı oluşturulmamış

### 2. Password Hash Sorunu
- Password hash yanlış veya eşleşmiyor
- Bcrypt hash formatı yanlış

### 3. Environment Variables Eksik
- JWT_SECRET eksik (düzeltildi ama kontrol edilmeli)
- SUPABASE_SERVICE_ROLE_KEY eksik
- NEXT_PUBLIC_SUPABASE_URL eksik

### 4. Database Connection Sorunu
- Supabase bağlantısı kurulamıyor
- RLS policies sorun çıkarıyor

## Debug Adımları

### Adım 1: Vercel Logs Kontrolü

Vercel Dashboard → Deployments → Latest → Functions → Logs

Login denemesinde ne görünüyor kontrol edin.

### Adım 2: Database'de Kullanıcı Kontrolü

Supabase Dashboard → Table Editor → admin_users veya users

`flaneur@gmail.com` var mı kontrol edin.

### Adım 3: Password Hash Kontrolü

Eğer kullanıcı varsa:
- Password hash doğru mu?
- Bcrypt formatında mı?

### Adım 4: Test Kullanıcı Oluştur

Supabase SQL Editor'de:

```sql
-- Admin kullanıcı oluştur
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'flaneur@gmail.com',
  'Test User',
  '$2a$10$YourBcryptHashHere', -- Buraya doğru hash gelecek
  'admin',
  true
);
```

## Hızlı Çözüm

1. Supabase'de kullanıcıyı kontrol et
2. Yoksa oluştur
3. Password hash'i doğru oluştur
4. Login tekrar dene


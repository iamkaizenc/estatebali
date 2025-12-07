# 🚨 LOGIN SORUNU - ADIM ADIM ÇÖZÜM

## ⚠️ ÖNEMLİ: Supabase Auth KULLANILMIYOR!

**Bu projede Supabase Authentication kullanılmıyor!**
- ❌ Supabase Auth panelinden eklenen kullanıcılar **ÇALIŞMAZ**
- ✅ Kullanıcılar `admin_users` ve `users` **tablolarında** olmalı
- ✅ Custom authentication sistemi kullanılıyor (JWT + bcrypt)

---

## ✅ ÇÖZÜM: 3 ADIM

### ADIM 1: Supabase SQL Editor'e Git

1. Supabase Dashboard'u aç
2. Sol menüden **SQL Editor**'e tıkla
3. **New Query** butonuna tıkla

### ADIM 2: SQL Script'ini Çalıştır

`FIX_LOGIN_IMMEDIATE.sql` dosyasının içeriğini kopyala ve SQL Editor'de çalıştır.

Bu script:
- ✅ `admin_users` tablosuna admin kullanıcı ekler
- ✅ `users` tablosuna test kullanıcı ekler
- ✅ Email'leri normalize eder (lowercase)
- ✅ Kontrol sorguları çalıştırır

### ADIM 3: Login Dene

**Test Credentials:**

1. **Admin User:**
   - Email: `admin@estatebali.app`
   - Password: `admin123`

2. **Test User:**
   - Email: `test@estatebali.app`
   - Password: `Test123456!`

---

## 🔍 SORUN DEVAM EDERSE

### 1. Browser Console Kontrol

F12 → Network tab → Login yap → `/api/auth/login` request'ini bul:
- Status: 200 mi?
- Response: `success: true` mu yoksa `success: false` mu?
- Error mesajı ne?

### 2. Vercel Logs Kontrol

Vercel Dashboard → Deployments → Functions → `/api/auth/login`

`[Login]` ile başlayan logları ara:
- `[Login] Admin user check:` → `found: true` mu?
- `[Login] Password verification:` → `passwordMatch: true` mu?

### 3. Database Kontrol

Supabase SQL Editor'de:

```sql
-- Kullanıcılar var mı kontrol et
SELECT 
  'admin_users' as table,
  email,
  active,
  password_hash IS NOT NULL as has_hash
FROM admin_users
WHERE email = 'admin@estatebali.app'

UNION ALL

SELECT 
  'users' as table,
  email,
  verified as active,
  password_hash IS NOT NULL as has_hash
FROM users
WHERE email = 'test@estatebali.app';
```

**Beklenen Sonuç:**
- `has_hash = true` olmalı
- `active = true` olmalı

---

## 📋 CHECKLIST

- [ ] `FIX_LOGIN_IMMEDIATE.sql` çalıştırıldı mı?
- [ ] Database'de kullanıcılar var mı? (SQL ile kontrol et)
- [ ] `password_hash IS NOT NULL = true` mi?
- [ ] `active = true` (admin için) veya `verified = true` (user için) mi?
- [ ] Email lowercase mi? (Normalize edildi mi?)
- [ ] Browser console'da `/api/auth/login` response'u ne diyor?
- [ ] Vercel logs'da `[Login]` mesajları ne gösteriyor?

---

## 🆘 HALA ÇALIŞMIYORSA

1. **Vercel logs'dan** `[Login]` ile başlayan tüm mesajları kopyala
2. **Browser Network tab'dan** `/api/auth/login` response'unu kopyala
3. **Database'deki kullanıcı bilgilerini** paylaş (hash hariç)

Bu bilgilerle daha spesifik yardım edebilirim.


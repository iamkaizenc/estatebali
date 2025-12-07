# 🔴 LOGIN SORUNU - HIZLI ÇÖZÜM

## ⚠️ ÖNEMLİ: Bu Projede Supabase Auth KULLANILMIYOR!

Bu projede **custom authentication** sistemi var:
- Supabase Auth ❌
- Custom JWT + bcrypt ✅
- `admin_users` ve `users` tablolarında password hash'leri saklanıyor

---

## ✅ HIZLI ÇÖZÜM ADIMLARI

### 1. Database'de Kullanıcı Var Mı?

Supabase SQL Editor'de çalıştır:

```sql
-- Admin users kontrol
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview
FROM admin_users;

-- Regular users kontrol
SELECT 
  email,
  name,
  role,
  verified,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_preview
FROM users
LIMIT 10;
```

**Eğer hiç kullanıcı yoksa veya `has_password = false` ise:**

### 2. Test Admin Kullanıcısı Oluştur

```sql
-- Admin kullanıcı oluştur (password: admin123)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2b$10$BL/WfWT7VDFO4zbCPfBbhOT5a41MnnXUHfU72uoG2yB7fgYmUlwi2',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true,
  role = EXCLUDED.role;

-- Kontrol et
SELECT 
  email,
  name,
  role,
  active,
  password_hash IS NOT NULL as has_password
FROM admin_users
WHERE email = 'admin@estatebali.app';
```

**Test Credentials:**
- Email: `admin@estatebali.app`
- Password: `admin123`

---

### 3. Yeni Kullanıcı Oluştur (Register Sayfasından)

1. `/register` sayfasına git
2. Yeni kullanıcı oluştur
3. Sonra login dene

---

### 4. Browser Console'u Kontrol Et

1. F12 → Network tab
2. Login yap
3. `/api/auth/login` request'ini bul
4. Response'u kontrol et:
   - `success: false` → Error mesajını oku
   - `success: true` → Token dönüyor mu?

---

### 5. Vercel Logs Kontrol

Vercel Dashboard → Deployments → Functions → `/api/auth/login`

`[Login]` ile başlayan logları ara:
- `[Login] Admin user check:` → Kullanıcı bulundu mu?
- `[Login] Password verification:` → Password match oldu mu?
- `[Login] User not found:` → Kullanıcı hiç yok

---

### 6. Email Case Sensitivity Sorunu

Email'ler artık lowercase'e normalize ediliyor. Ama database'deki email'ler büyük harfle başlıyorsa sorun olabilir.

**Çözüm:** Database'deki email'leri lowercase'e çevir:

```sql
-- Admin users email'leri normalize et
UPDATE admin_users 
SET email = LOWER(TRIM(email));

-- Regular users email'leri normalize et
UPDATE users 
SET email = LOWER(TRIM(email));
```

---

### 7. Password Hash Formatı Kontrol

Password hash'leri bcrypt formatında olmalı: `$2b$10$...`

**Eğer hash formatı yanlışsa:**

Node.js'te yeni hash oluştur:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"
```

Sonra database'de güncelle:

```sql
UPDATE admin_users 
SET password_hash = '$2b$10$YENI_HASH_BURAYA'
WHERE email = 'admin@estatebali.app';
```

---

## 🚨 YAYGIN SORUNLAR

### Sorun 1: "User not found"
**Çözüm:** Kullanıcı database'de yok. Yukarıdaki SQL ile oluştur.

### Sorun 2: "Password mismatch"
**Çözüm:** Password hash yanlış. Yeni hash oluştur ve güncelle.

### Sorun 3: "Account configuration error"
**Çözüm:** `password_hash` NULL. Yukarıdaki SQL ile güncelle.

### Sorun 4: Rate Limiting
**Çözüm:** Çok fazla deneme yaptın. 15 dakika bekle veya Redis'i temizle.

---

## 📋 CHECKLIST

- [ ] Database'de kullanıcı var mı? (SQL ile kontrol et)
- [ ] Password hash var mı? (`has_password = true`)
- [ ] Hash formatı doğru mu? (`$2b$10$...`)
- [ ] Email lowercase mi? (Normalize et)
- [ ] `active = true` mi? (Admin users için)
- [ ] Browser console'da error var mı?
- [ ] Vercel logs'da `[Login]` mesajları var mı?

---

## 🆘 HALA ÇALIŞMIYORSA

1. Vercel logs'dan `[Login]` ile başlayan tüm mesajları kopyala
2. Browser Network tab'dan `/api/auth/login` response'unu kopyala
3. Database'deki kullanıcı bilgilerini (hash hariç) paylaş

Bu bilgilerle daha spesifik yardım edebilirim.


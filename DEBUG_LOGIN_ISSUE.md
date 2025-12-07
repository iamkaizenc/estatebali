# 🐛 Login Sorunu Debug Rehberi

## Sorun

Kayıt olunca Supabase'e kayıt işliyor ama aynı bilgilerle login yapılamıyor.

## Hızlı Kontrol Adımları

### 1. Database'de Kullanıcıyı Kontrol Et

**Supabase SQL Editor'de:**

```sql
-- Son kayıt olan kullanıcıyı bul
SELECT 
  email,
  name,
  password_hash IS NOT NULL as has_password_hash,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_format,
  role,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

**Beklenen Sonuçlar:**
- ✅ `has_password_hash`: `true`
- ✅ `hash_length`: `60` (bcrypt hash uzunluğu)
- ✅ `hash_format`: `$2a$10$` veya `$2b$10$` ile başlamalı

### 2. Belirli Bir Email'i Kontrol Et

```sql
-- Kayıt olunan email'i kontrol et
SELECT 
  email,
  name,
  password_hash IS NOT NULL as has_password,
  CASE 
    WHEN password_hash IS NULL THEN 'NULL'
    WHEN password_hash = '' THEN 'EMPTY'
    WHEN LENGTH(password_hash) < 60 THEN 'TOO_SHORT'
    ELSE 'OK'
  END as hash_status,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_start
FROM users
WHERE email = 'KAYIT_OLUNAN_EMAIL@example.com';
```

### 3. Login Log'larını Kontrol Et

Login yaparken şu log'ları göreceksiniz:

**Browser Console (Client-side):**
- Network tab → `/api/auth/login` request → Response

**Server Log'lar (Vercel/Production):**
- Vercel Dashboard → Deployments → Functions → Logs
- Arama: `[Login]`

**Local Development:**
- Terminal'de Next.js server log'ları

## Olası Sorunlar ve Çözümler

### Sorun 1: Password Hash NULL

**Belirti:**
```sql
SELECT password_hash FROM users WHERE email = '...';
-- Sonuç: NULL
```

**Çözüm:**
1. `password_hash` kolonu eksik olabilir
2. Migration çalıştırılmamış olabilir

**Migration:**
```sql
-- supabase/migrations/fix_users_table_simple.sql dosyasını çalıştır
```

### Sorun 2: Password Hash Boş String

**Belirti:**
```sql
SELECT password_hash FROM users WHERE email = '...';
-- Sonuç: '' (empty string)
```

**Çözüm:**
Registration sırasında hash kaydedilmemiş. Yeni hash oluştur:

```sql
-- 1. Hash oluştur (Node.js)
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRE', 10));"

-- 2. Database'de güncelle
UPDATE users 
SET password_hash = 'YENI_HASH_BURAYA'
WHERE email = 'kullanici@example.com';
```

### Sorun 3: Password Hash Formatı Yanlış

**Belirti:**
```sql
SELECT LEFT(password_hash, 10) FROM users WHERE email = '...';
-- Sonuç: '$2a$10$' ile başlamıyor
```

**Çözüm:**
Hash yanlış kaydedilmiş. Yeni hash oluştur ve güncelle (yukarıdaki adımlar).

### Sorun 4: Login Sırasında Hash Okunamıyor

**Belirti:**
Log'larda görünen:
```
[Login] Regular user check: {
  found: true,
  hasPasswordHash: false  // ← SORUN BURADA
}
```

**Çözüm:**
1. RLS (Row Level Security) politikalarını kontrol et
2. Service role key doğru mu kontrol et
3. Database'de hash var mı kontrol et

### Sorun 5: bcrypt.compare Başarısız

**Belirti:**
Log'larda görünen:
```
[Login] Password verification: {
  passwordMatch: false  // ← SORUN BURADA
}
```

**Çözüm:**
1. Şifre doğru yazılmış mı kontrol et
2. Hash formatı doğru mu kontrol et
3. Yeni hash oluştur ve test et

## Test Senaryosu

### Adım 1: Yeni Kullanıcı Kaydet

1. `/register` sayfasına git
2. Yeni bir email ve şifre ile kayıt ol
3. Başarılı kayıt mesajını gör

### Adım 2: Database'i Kontrol Et

```sql
SELECT 
  email,
  password_hash IS NOT NULL as has_hash,
  LENGTH(password_hash) as hash_len
FROM users
WHERE email = 'YENI_KAYIT_EMAIL'
ORDER BY created_at DESC
LIMIT 1;
```

**Beklenen:**
- `has_hash`: `true`
- `hash_len`: `60`

### Adım 3: Login Yap

1. `/login` sayfasına git
2. Aynı email ve şifre ile login yap
3. Console log'larını kontrol et

### Adım 4: Log'ları Analiz Et

**Başarılı Login:**
```
[Login] Regular user check: { found: true, hasPasswordHash: true }
[Login] Password verification: { passwordMatch: true }
[Login] Success for user: { email: '...', role: 'user' }
```

**Başarısız Login:**
```
[Login] Regular user check: { found: true, hasPasswordHash: false }
// veya
[Login] Password verification: { passwordMatch: false }
```

## Hızlı Düzeltme

Eğer acil çözüm gerekiyorsa:

```sql
-- 1. Kullanıcının mevcut durumunu kontrol et
SELECT email, password_hash IS NOT NULL, created_at 
FROM users 
WHERE email = 'KAYIT_OLUNAN_EMAIL';

-- 2. Yeni hash oluştur (Terminal'de)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRE', 10));"

-- 3. Database'de güncelle
UPDATE users 
SET password_hash = 'YENI_OLUSTURULAN_HASH'
WHERE email = 'KAYIT_OLUNAN_EMAIL';

-- 4. Kontrol et
SELECT email, LEFT(password_hash, 10) as hash_format, LENGTH(password_hash) as hash_len
FROM users 
WHERE email = 'KAYIT_OLUNAN_EMAIL';
```

## İletişim

Sorun devam ederse, şu bilgileri toplayın:

1. **Database sorgu sonucu:**
   ```sql
   SELECT email, password_hash IS NOT NULL, LENGTH(password_hash), LEFT(password_hash, 10)
   FROM users WHERE email = 'KAYIT_OLUNAN_EMAIL';
   ```

2. **Login log'ları:**
   - Browser console log'ları
   - Server log'ları (Vercel Dashboard)

3. **Kayıt log'ları:**
   - Kayıt olurken görünen log'lar


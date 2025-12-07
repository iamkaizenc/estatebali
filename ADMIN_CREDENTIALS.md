# 🔑 Admin Giriş Bilgileri

## Mevcut Admin Kullanıcılar

Database'deki admin kullanıcıları kontrol etmek için:

**Supabase Dashboard → SQL Editor:**

```sql
-- Tüm admin kullanıcıları listele
SELECT 
  email, 
  name, 
  role, 
  active, 
  created_at,
  last_login
FROM admin_users
ORDER BY created_at DESC;
```

## Default Admin Bilgileri

Dokümantasyonda belirtilen default bilgiler:

**Email:** `admin@estatebali.app`  
**Password:** `admin123`

⚠️ **ÖNEMLİ:** Bu bilgiler sadece development için. Production'da mutlaka değiştirilmeli!

## Admin Kullanıcı Oluşturma

Eğer database'de admin kullanıcı yoksa:

### 1. Password Hash Oluştur

**Terminal'de:**
```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRENIZ', 10));"
```

**VEYA online:** https://bcrypt-generator.com/

### 2. Admin Kullanıcı Oluştur

**Supabase SQL Editor:**

```sql
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'your-email@gmail.com',
  'Admin Name',
  'BURAYA_BCRYPT_HASH', -- Yukarıdaki komuttan aldığınız hash
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true;
```

## Mevcut Kullanıcıları Kontrol Et

```sql
-- Admin users
SELECT email, name, role, active FROM admin_users;

-- Regular users (bazıları admin olabilir)
SELECT email, name, role FROM users;
```

## Login

1. `/login` sayfasına git
2. Email ve şifrenizi girin
3. Başarılı girişte admin rolündeyseniz `/admin` sayfasına yönlendirilirsiniz


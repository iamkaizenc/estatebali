# 🔧 Login Sorunu Çözüm Rehberi

## Sorun

Kayıt olunca Supabase'e kayıt işliyor ama aynı bilgilerle login yapılamıyor.

## Olası Sebepler ve Çözümler

### 1. Password Hash Yanlış Kaydediliyor

**Kontrol:**
```sql
SELECT 
  email,
  name,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 7) as hash_format
FROM users
WHERE email = 'kayit-olan-email@example.com';
```

**Beklenen:**
- `has_password`: `true`
- `hash_length`: `60` (bcrypt hash uzunluğu)
- `hash_format`: `$2a$10$` veya `$2b$10$` (bcrypt formatı)

### 2. Login Sırasında Hash Okunamıyor

**Kontrol:**
Login yaparken browser console veya server log'larında şunları kontrol et:

```
[Login] Regular user check: {
  found: true/false,
  hasPasswordHash: true/false,
  passwordHashLength: 60 (olmalı)
}
```

### 3. Password Verification Başarısız

**Debug:**
Login fonksiyonu şu log'ları üretiyor:
- `[Login] Password verification result:` - Password match durumu
- `[Login] Password mismatch for user:` - Şifre yanlış

## Hızlı Test ve Çözüm

### Test 1: Database'de Kullanıcıyı Kontrol Et

```sql
-- Supabase SQL Editor'de çalıştır
SELECT 
  email,
  name,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as hash_length,
  LEFT(password_hash, 10) as hash_start,
  created_at
FROM users
WHERE email = 'KAYIT_OLUNAN_EMAIL'
ORDER BY created_at DESC
LIMIT 1;
```

**Eğer `has_password = false` veya `hash_length = 0` ise:**
- Registration sırasında password_hash kaydedilmemiş
- Migration çalıştırılmamış olabilir

### Test 2: Yeni Bir Hash Oluştur ve Test Et

Eğer hash var ama login yapılamıyorsa:

```sql
-- 1. Şifre hash'i oluştur (Node.js)
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRE', 10));"

-- 2. Database'de güncelle
UPDATE users 
SET password_hash = 'YENI_HASH'
WHERE email = 'KAYIT_OLUNAN_EMAIL';
```

### Test 3: Login Log'larını Kontrol Et

Development mode'da login yaparken console'da şu log'lar görünecek:

```
[Login] Regular user check: { ... }
[Login] Password verification result: { passwordMatch: true/false }
```

## Geçici Çözüm: Şifre Reset

Eğer acil çözüm gerekiyorsa:

1. **Yeni bir hash oluştur:**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YENI_SIFRE', 10));"
   ```

2. **Database'de güncelle:**
   ```sql
   UPDATE users 
   SET password_hash = 'YENI_HASH'
   WHERE email = 'kullanici@example.com';
   ```

3. **Yeni şifre ile login yap**

## Kalıcı Çözüm

Login fonksiyonu şu iyileştirmelerle güncellendi:

1. ✅ `.maybeSingle()` kullanılıyor (null handling daha iyi)
2. ✅ Detaylı debug log'lar eklendi
3. ✅ Error handling iyileştirildi
4. ✅ Password hash format kontrolü eklendi

## Sorun Devam Ederse

1. **Server log'larını kontrol et:**
   - Vercel Dashboard → Deployments → Functions → Logs
   - Veya local'de terminal'de log'ları göreceksiniz

2. **Database'i kontrol et:**
   - Supabase Dashboard → Table Editor → users
   - Password_hash kolonunu kontrol et

3. **Registration'ı kontrol et:**
   - Kayıt olurken console log'larını kontrol et
   - Password hash'in kaydedilip kaydedilmediğini kontrol et

## İletişim

Sorun devam ederse, şu bilgileri toplayın:
- Login yaparken görünen console log'ları
- Database'deki kullanıcı bilgileri (password_hash hariç)
- Kayıt olurken görünen log'lar


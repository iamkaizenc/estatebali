# 🔍 Login Sorunu - Debug ve Çözüm

## Sorun

Kayıt olunca Supabase'e kayıt işliyor ama aynı bilgilerle login yapılamıyor.

## Olası Sebepler

1. **Password hash formatı uyumsuzluğu**
   - Registration: `bcrypt.hash(password, 10)` kullanılıyor ✅
   - Login: `bcrypt.compare(password, password_hash)` kullanılıyor ✅
   - Sorun: Hash formatı yanlış kaydediliyor olabilir

2. **Database kolonu eksik veya yanlış**
   - `users` tablosunda `password_hash` kolonu yok
   - Kolon var ama veri kaydedilmiyor

3. **RLS (Row Level Security) Politikaları**
   - Login sırasında `password_hash` okunamıyor olabilir
   - Service role key ile erişim yapılıyor ama yine de sorun olabilir

4. **Role mapping problemi**
   - Registration'da role: "customer"
   - Login'de role: "customer" → "user" olarak map ediliyor
   - Bu bir sorun değil ama kontrol edilmeli

## Çözüm Adımları

### Adım 1: Database'de Kullanıcıyı Kontrol Et

Supabase SQL Editor'de:

```sql
-- Kullanıcıyı bul ve password_hash'i kontrol et
SELECT 
  email,
  name,
  role,
  password_hash IS NOT NULL as has_password,
  LENGTH(password_hash) as password_hash_length,
  LEFT(password_hash, 10) as password_hash_preview,
  created_at
FROM users
WHERE email = 'kayit-olunan-email@example.com';
```

**Beklenen:**
- `has_password`: `true` olmalı
- `password_hash_length`: 60 karakter olmalı (bcrypt hash)
- `password_hash_preview`: `$2a$10$` veya `$2b$10$` ile başlamalı

### Adım 2: Password Hash'i Manuel Test Et

Eğer password_hash var ama login yapılamıyorsa:

```sql
-- Password hash'i kopyala ve test et
SELECT password_hash 
FROM users 
WHERE email = 'kayit-olunan-email@example.com';
```

Sonra Node.js'te test et:

```javascript
const bcrypt = require('bcryptjs');
const hash = 'DATABASE_DEN_KOPYALANAN_HASH';
const password = 'KAYIT_OLURKEN_KULLANILAN_SIFRE';

bcrypt.compare(password, hash).then(result => {
  console.log('Password match:', result);
});
```

### Adım 3: Login Fonksiyonuna Daha Fazla Debug Ekle

`src/lib/auth.ts` dosyasında login fonksiyonuna daha detaylı log'lar eklenecek.

### Adım 4: Registration'da Password Hash Kontrolü

Registration sonrası kaydedilen hash'i kontrol et.

## Hızlı Test

### Test 1: Yeni Kullanıcı Kaydet

1. Yeni bir email ile kayıt ol
2. Supabase'de kontrol et:
   ```sql
   SELECT email, password_hash IS NOT NULL, created_at 
   FROM users 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

### Test 2: Login Yap

1. Aynı email ve şifre ile login yap
2. Console log'larını kontrol et (development mode'da)

## Geçici Çözüm

Eğer acil çözüm gerekiyorsa, kullanıcının şifresini reset edebilirsiniz:

```sql
-- Yeni bir hash oluştur (Node.js'te)
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YENI_SIFRE', 10));"

-- Database'de güncelle
UPDATE users 
SET password_hash = 'YENI_OLUSTURULAN_HASH'
WHERE email = 'kullanici@example.com';
```

## Kalıcı Çözüm

Login fonksiyonunu güncelleyerek daha iyi error handling ve debug log'ları ekleyeceğiz.


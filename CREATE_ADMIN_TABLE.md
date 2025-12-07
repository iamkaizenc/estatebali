# 🔧 Admin Users Tablosu Oluşturma

## Sorun

Database'de `admin_users` tablosu mevcut değil. Bu tablo admin girişi için gereklidir.

## Çözüm

### Adım 1: Migration Dosyasını Çalıştır

**Supabase Dashboard → SQL Editor**'e gidin ve aşağıdaki migration dosyasını açın:

📁 **Dosya:** `supabase/migrations/create_admin_users_table.sql`

Bu dosyanın içeriğini kopyalayıp Supabase SQL Editor'de çalıştırın.

### Adım 2: Admin Kullanıcı Oluştur

Tablo oluşturulduktan sonra, bir admin kullanıcı oluşturmanız gerekiyor.

#### 2.1. Şifre Hash'i Oluştur

**Seçenek 1: Online Tool (En Kolay)**
- https://bcrypt-generator.com/ adresine gidin
- Şifrenizi girin (örneğin: `admin123`)
- Cost: `10` seçin
- "Generate" butonuna tıklayın
- Oluşan hash'i kopyalayın

**Seçenek 2: Terminal'de**
```bash
cd /Users/kaizen/estatebali
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SIFRENIZ', 10));"
```

#### 2.2. Admin Kullanıcı Ekle

**Supabase SQL Editor'de çalıştırın:**

```sql
-- ÖNEMLİ: BURAYA KENDİ ŞİFRENİZİN HASH'İNİ YAPIŞTIRIN
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  'BURAYA_BCRYPT_HASH_YAPIŞTIR', -- Yukarıdaki adımdan aldığınız hash
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;
```

### Adım 3: Kontrol Et

Admin kullanıcının oluşturulduğunu kontrol edin:

```sql
SELECT email, name, role, active, created_at 
FROM admin_users;
```

## 🚀 Hızlı Başlangıç (Tüm Adımlar Tek Seferde)

Eğer hemen test etmek istiyorsanız, şifre hash'i `admin123` için hazır:

```sql
-- 1. Tabloyu oluştur
-- supabase/migrations/create_admin_users_table.sql dosyasını çalıştırın

-- 2. Default admin kullanıcı ekle (şifre: admin123)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;
```

⚠️ **ÖNEMLİ:** Production'da mutlaka şifreyi değiştirin!

## 📝 Notlar

- Admin kullanıcılar RLS (Row Level Security) ile korunur
- Sadece service role key ile erişilebilir
- `last_login` alanı otomatik olarak güncellenir
- `updated_at` alanı otomatik olarak güncellenir

## 🔐 Güvenlik

- Production'da mutlaka güçlü bir şifre kullanın
- Şifre hash'i asla kod içinde hardcode etmeyin
- Admin kullanıcıları düzenli olarak kontrol edin
- İhtiyaç duyulmayan admin hesaplarını deaktif edin (`active = false`)


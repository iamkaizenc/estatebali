# Supabase Entegrasyon Rehberi

## ✅ Tamamlanan Entegrasyonlar

### 1. Database Schema
- ✅ Properties table oluşturuldu
- ✅ Admin users table oluşturuldu
- ✅ Users table oluşturuldu
- ✅ Indexes ve RLS policies eklendi
- ✅ Triggers eklendi

### 2. Supabase Client
- ✅ `src/lib/supabase.ts` - Client ve admin client oluşturuldu
- ✅ Type conversion functions eklendi
- ✅ Database types tanımlandı

### 3. API Routes
- ✅ `GET /api/properties` - Supabase'den property'leri getir
- ✅ `POST /api/properties` - Supabase'e yeni property ekle (Admin only)
- ✅ `GET /api/properties/[id]` - Supabase'den tek property getir
- ✅ `PUT /api/properties/[id]` - Supabase'de property güncelle (Admin only)
- ✅ `DELETE /api/properties/[id]` - Supabase'den property sil (Admin only)

### 4. Frontend Entegrasyonu
- ✅ `useProperties` hook oluşturuldu
- ✅ `useProperty` hook oluşturuldu
- ✅ Tüm sayfalar Supabase API'ye bağlandı:
  - Home page
  - Properties page
  - Buy page
  - Rent page
  - Featured page
  - Area page
  - Property detail page
  - Admin panel

### 5. Admin Authentication
- ✅ Supabase admin_users table entegrasyonu
- ✅ Password hash kontrolü (bcrypt)
- ✅ Token-based authentication

## 🚀 Kurulum Adımları

### Adım 1: Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) adresine git
2. Yeni proje oluştur
3. Project URL ve API keys'i al

### Adım 2: Environment Variables

`.env.local` dosyası oluştur (root dizinde):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Adım 3: Database Schema Oluştur

1. Supabase Dashboard'a git
2. SQL Editor'ü aç
3. `supabase/schema.sql` dosyasındaki SQL'i çalıştır
4. Tüm tablolar, indexler ve policies oluşturulacak

### Adım 4: Seed Data (Opsiyonel)

1. SQL Editor'de `supabase/seed.sql` dosyasındaki SQL'i çalıştır
2. Örnek property'ler eklenecek
3. Admin kullanıcı oluşturulacak

### Adım 5: Admin Password Hash

**ÖNEMLİ:** Production'da admin password'ü hash'leyin:

```bash
# Node.js ile bcrypt hash oluştur
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

Veya online tool kullanın: https://bcrypt-generator.com/

Hash'i `supabase/seed.sql` dosyasındaki `password_hash` değerine ekleyin.

### Adım 6: Test

1. Development server'ı başlat: `npm run dev`
2. `/admin/login` sayfasına git
3. `admin@estatebali.app` / `admin123` ile giriş yap
4. Admin panelinde property'leri yönet

## 📊 Database Yapısı

### Properties Table
- Tüm property bilgileri
- Location, details, features JSONB formatında
- Full-text search desteği
- Indexes ile optimize edilmiş

### Admin Users Table
- Admin kullanıcıları
- Password hash'leri
- Role-based access

### Users Table
- Müşteri ve agent bilgileri
- Gelecek özellikler için hazır

## 🔐 Güvenlik

### Row Level Security (RLS)
- Properties: Herkes okuyabilir, sadece admin yazabilir
- Admin users: Sadece admin görebilir
- Users: Herkes görebilir, kullanıcılar kendi verilerini güncelleyebilir

### API Authentication
- Admin işlemleri token gerektirir
- `verifyAdminAuth` middleware ile kontrol edilir

## 🔄 Migration

### Mevcut Mock Data'yı Supabase'e Aktarma

1. `supabase/seed.sql` dosyasını çalıştır
2. Veya admin panelinden manuel olarak ekle

### Production Migration

1. Supabase Dashboard > Database > Migrations
2. Yeni migration oluştur
3. Schema değişikliklerini ekle

## 📝 Notlar

- Şu anda mock data fallback mevcut (Supabase bağlantısı yoksa)
- Environment variables set edilmediğinde API hata verebilir
- Production'da mutlaka password hash kullanın
- Service role key'i sadece server-side kullanın, client-side'a expose etmeyin

## 🐛 Troubleshooting

### "Supabase URL is required" hatası
- `.env.local` dosyasını kontrol edin
- Environment variables'ın doğru olduğundan emin olun

### "Property not found" hatası
- Database'de property var mı kontrol edin
- Seed data'yı çalıştırdınız mı?

### Authentication hatası
- Admin user'ın database'de olduğundan emin olun
- Password hash'in doğru olduğundan emin olun

## 🎯 Sonraki Adımlar

1. ✅ Supabase projesi oluştur
2. ✅ Environment variables ekle
3. ✅ Schema'yı çalıştır
4. ✅ Seed data'yı ekle
5. ✅ Test et
6. ✅ Production'a deploy et


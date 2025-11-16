# ✅ Yayına Hazırlık Checklist

## 🚀 Vercel Deployment Adımları

### 1. Vercel'de Proje Oluştur
- [ ] [vercel.com](https://vercel.com) → Login
- [ ] "Add New Project"
- [ ] GitHub repo: `iamkaizenc/estatebali` → Import
- [ ] Framework: Next.js (otomatik)

### 2. Environment Variables Ekle

**Vercel Dashboard → Project → Settings → Environment Variables**

Aşağıdaki değişkenleri **Production**, **Preview**, **Development** için ekle:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hfsdvopvsttqcildsyvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjQxNDIsImV4cCI6MjA3ODYwMDE0Mn0.yFDWcYA2Y_df0FwOyKhnbyV0nS0mTnXNmkYKllhNmo4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyNDE0MiwiZXhwIjoyMDc4NjAwMTQyfQ.MrTnfmH8AOzOymO8QRqvKpE30Ra2_bQSS6z_pMJmav4
NODE_ENV=production
```

**Deploy sonrası URL'i alıp ekle:**
```env
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 3. Deploy
- [ ] "Deploy" butonuna tıkla
- [ ] Build'in tamamlanmasını bekle (1-3 dk)
- [ ] ✅ Başarılı olursa URL'i al

### 4. Supabase Database Setup

**Supabase Dashboard → SQL Editor:**

1. `supabase/migrations/combined_migrations.sql` dosyasını çalıştır
   - [ ] Password hash column eklendi
   - [ ] Password reset tokens table oluşturuldu
   - [ ] Storage bucket oluşturuldu

2. `supabase/storage-setup.sql` dosyasını çalıştır (opsiyonel, eğer yoksa)
   - [ ] property-images bucket oluşturuldu
   - [ ] RLS policies eklendi

### 5. İlk Admin Kullanıcı Oluştur

**Supabase Dashboard → SQL Editor:**

```sql
-- Admin kullanıcı oluştur (şifreyi kendi şifrenizle değiştirin)
INSERT INTO admin_users (email, name, password_hash, role, active)
VALUES (
  'admin@estatebali.app',
  'Admin User',
  '$2a$10$YourHashedPasswordHere', -- bcrypt hash
  'admin',
  true
);
```

**Şifre hash için:**
- Node.js console'da: `bcrypt.hashSync('your_password', 10)`
- Veya online bcrypt tool kullanın

### 6. Test Checklist

- [ ] Ana sayfa açılıyor
- [ ] Properties listeleniyor
- [ ] Login sayfası çalışıyor
- [ ] Register sayfası çalışıyor
- [ ] Admin panel erişilebilir
- [ ] Property oluşturma çalışıyor
- [ ] Image upload çalışıyor
- [ ] Mobile responsive

### 7. Video Background (Opsiyonel)

Eğer video kullanacaksanız:
- [ ] `hero-background.mp4` dosyasını `public/` klasörüne ekle
- [ ] Dosya boyutu 2-10MB arası olmalı
- [ ] Çözünürlük: 1920x1080 önerilir

---

## 📊 Build Durumu

✅ **Local Build:** Başarılı
✅ **TypeScript:** No errors
✅ **Lint:** Skipped (build sırasında)
✅ **Routes:** 31 route hazır

---

## 🎯 Son Durum

**Status:** 🟢 **Yayına Hazır!**

**Son Yapılanlar:**
- ✅ Vercel build hataları düzeltildi
- ✅ Video background desteği eklendi
- ✅ Security headers eklendi
- ✅ Environment validation hazır
- ✅ Production ready documentation

**Yapılacaklar:**
1. Vercel'de proje oluştur
2. Environment variables ekle
3. Deploy et
4. Supabase migration'ları çalıştır
5. Test et

---

**Detaylı bilgi için:**
- `VERCEL_DEPLOYMENT.md` - Vercel deployment rehberi
- `PRODUCTION_READY.md` - Production hazırlık durumu
- `SUPABASE_SETUP.md` - Supabase kurulum rehberi


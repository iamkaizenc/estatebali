# 🚀 Production Yayına Hazırlık Kontrol Listesi

**Tarih:** $(date)

---

## ✅ Tamamlanan Hazırlıklar

### 🔒 Güvenlik
- [x] Hardcoded credentials kaldırıldı (sadece development)
- [x] Security headers eklendi (next.config.js)
- [x] Environment variables validation
- [x] Password strength requirements (8+ karakter)
- [x] Rate limiting implementasyonu
- [x] Input validation (Zod schemas)
- [x] CORS ayarları

### 🗄️ Database & Backend
- [x] Supabase entegrasyonu tamamlandı
- [x] Database schema hazır
- [x] API routes hazır
- [x] Migration dosyaları hazır

### 🎨 Frontend
- [x] Responsive design
- [x] Error boundaries
- [x] Loading states
- [x] Video background support
- [x] Area-specific images

### 📦 Build & Deployment
- [x] Next.js 14.2.3
- [x] TypeScript configuration
- [x] Build optimizations
- [x] .gitignore configured
- [x] Vercel build fixes

---

## 🔴 Vercel Deployment Öncesi Yapılacaklar

### 1. Environment Variables (ZORUNLU)

Vercel Dashboard → Project → Settings → Environment Variables

**Production için ekleyin:**

```env
# Supabase (Zorunlu)
NEXT_PUBLIC_SUPABASE_URL=https://hfsdvopvsttqcildsyvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjQxNDIsImV4cCI6MjA3ODYwMDE0Mn0.yFDWcYA2Y_df0FwOyKhnbyV0nS0mTnXNmkYKllhNmo4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyNDE0MiwiZXhwIjoyMDc4NjAwMTQyfQ.MrTnfmH8AOzOymO8QRqvKpE30Ra2_bQSS6z_pMJmav4

# App URL (Vercel deploy sonrası güncelleyin)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Node Environment
NODE_ENV=production
```

**Tüm environment variables'ları şunlar için etkinleştirin:**
- ✅ Production
- ✅ Preview  
- ✅ Development

### 2. Vercel Deployment Ayarları

**Build Settings:**
- Framework Preset: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Git Integration:**
- GitHub repo: `iamkaizenc/estatebali`
- Branch: `main`
- Auto-deploy: ✅ Enabled

### 3. Supabase Database Setup

**Migration'ları çalıştırın:**
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/combined_migrations.sql` dosyasını çalıştırın
3. `supabase/storage-setup.sql` dosyasını çalıştırın (storage bucket için)

**RLS Policies kontrolü:**
- Properties: Public read, authenticated write
- Users: Authenticated only
- Admin users: Admin only

### 4. Video Background Dosyası

**Opsiyonel - Eğer kullanılacaksa:**
- Dosya adı: `hero-background.mp4`
- Konum: `public/hero-background.mp4`
- Önerilen: 1920x1080, 2-10MB

---

## 🟡 Yayın Sonrası Yapılacaklar

### 1. İlk Kontroller
- [ ] Website açılıyor mu?
- [ ] Properties listeleniyor mu?
- [ ] Login/Register çalışıyor mu?
- [ ] Admin panel erişilebilir mi?
- [ ] Video/image'ler yükleniyor mu?

### 2. Email Service (Gelecekte)
- [ ] Resend veya SendGrid API key ekle
- [ ] Password reset email test et
- [ ] Email verification aktif et

### 3. Analytics (Gelecekte)
- [ ] Google Analytics ID ekle
- [ ] Event tracking ekle
- [ ] Conversion tracking kur

### 4. Monitoring (Gelecekte)
- [ ] Sentry veya benzeri error tracking
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Code pushed to GitHub
- [x] Environment variables documented
- [x] Build errors fixed
- [x] TypeScript errors fixed
- [x] Security headers added
- [x] Rate limiting added
- [x] Input validation added

### Deployment
- [ ] Vercel project created
- [ ] GitHub repo connected
- [ ] Environment variables added
- [ ] Build successful
- [ ] Domain configured (opsiyonel)

### Post-Deployment
- [ ] Website accessible
- [ ] Database connection working
- [ ] Authentication working
- [ ] All pages loading
- [ ] Images/videos loading
- [ ] Mobile responsive test

---

## 🆘 Troubleshooting

### Build Hataları
- Environment variables eksik mi kontrol edin
- Supabase credentials doğru mu kontrol edin
- Build loglarına bakın

### Database Hataları
- Supabase migration'ları çalıştırıldı mı?
- RLS policies aktif mi?
- Storage bucket oluşturuldu mu?

### Authentication Hataları
- Service role key doğru mu?
- Admin users table'da kullanıcı var mı?
- Token expiration kontrol edin

---

## 📞 Destek

Sorun yaşarsanız:
1. Vercel build loglarına bakın
2. Browser console'u kontrol edin
3. Supabase logs kontrol edin
4. GitHub issues açın

---

**Son Güncelleme:** $(date)
**Versiyon:** 1.0.0
**Status:** 🟢 Production Ready


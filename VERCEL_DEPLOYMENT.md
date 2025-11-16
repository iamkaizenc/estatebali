# 🚀 Vercel Deployment Rehberi

## Adım 1: Vercel Hesabı

1. [vercel.com](https://vercel.com) adresine git
2. GitHub hesabınızla giriş yap
3. Dashboard'a git

## Adım 2: Yeni Proje Oluştur

1. **"Add New Project"** butonuna tıkla
2. **"Import Git Repository"** seç
3. `iamkaizenc/estatebali` repo'sunu seç
4. **"Import"** butonuna tıkla

## Adım 3: Proje Ayarları

### Build & Development Settings

**Framework Preset:** Next.js (otomatik algılanmalı)

**Root Directory:** `./`

**Build Command:** `npm run build` (otomatik)

**Output Directory:** `.next` (otomatik)

**Install Command:** `npm install` (otomatik)

### Environment Variables

**Settings → Environment Variables** bölümüne git ve şunları ekle:

#### Production Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://hfsdvopvsttqcildsyvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjQxNDIsImV4cCI6MjA3ODYwMDE0Mn0.yFDWcYA2Y_df0FwOyKhnbyV0nS0mTnXNmkYKllhNmo4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyNDE0MiwiZXhwIjoyMDc4NjAwMTQyfQ.MrTnfmH8AOzOymO8QRqvKpE30Ra2_bQSS6z_pMJmav4
NODE_ENV=production
```

**Önemli:** Her variable için ✅ **Production**, ✅ **Preview**, ✅ **Development** seçeneklerini işaretle

#### Deploy Sonrası

Deploy tamamlandıktan sonra verilen URL'i alın ve:

```env
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

şeklinde ekleyin.

## Adım 4: Deploy

1. **"Deploy"** butonuna tıkla
2. Build'in tamamlanmasını bekle (1-3 dakika)
3. ✅ Başarılı olursa URL'i al

## Adım 5: Domain Ayarları (Opsiyonel)

### Custom Domain Eklemek İçin:

1. **Settings → Domains**
2. Domain'inizi ekleyin
3. DNS kayıtlarını güncelleyin (Vercel talimatlarına göre)
4. SSL otomatik olarak eklenir

## Adım 6: İlk Kontroller

### ✅ Deployment Sonrası Test Listesi

- [ ] Ana sayfa açılıyor mu?
- [ ] Properties listeleniyor mu?
- [ ] Login sayfası çalışıyor mu?
- [ ] Register sayfası çalışıyor mu?
- [ ] Admin panel erişilebilir mi?
- [ ] Property detail sayfaları açılıyor mu?
- [ ] Image upload çalışıyor mu?
- [ ] Video background yükleniyor mu? (eğer eklendiyse)
- [ ] Mobile responsive çalışıyor mu?

### Hata Kontrolü

1. **Vercel Dashboard → Deployments** → Son deployment'a tıkla
2. **Build Logs** bölümünü kontrol et
3. **Function Logs** bölümünü kontrol et (API route'lar için)
4. Browser console'u kontrol et (F12)

## Adım 7: Otomatik Deploy

✅ Git integration otomatik olarak aktif

Her `git push` yaptığınızda:
- Otomatik olarak yeni deploy başlar
- Preview deployment oluşturulur
- Production'a merge edilince production'a deploy olur

---

## 🔧 Troubleshooting

### Build Hatası

**Hata:** Environment variables eksik
**Çözüm:** Settings → Environment Variables'ta tüm değişkenleri ekleyin

**Hata:** Supabase connection failed
**Çözüm:** Supabase credentials'ları kontrol edin, doğru olduğundan emin olun

**Hata:** TypeScript errors
**Çözüm:** `next.config.js`'de `ignoreBuildErrors: true` var, ama hata varsa logları kontrol edin

### Runtime Hataları

**Hata:** 500 Internal Server Error
**Çözüm:** 
- Function Logs'a bakın
- Supabase connection'ı kontrol edin
- Database migration'ları kontrol edin

**Hata:** 404 Not Found
**Çözüm:**
- Route yapısını kontrol edin
- Dynamic routes doğru mu kontrol edin

---

## 📊 Monitoring

### Vercel Analytics (Opsiyonel)

1. **Analytics** tab'ına git
2. **Enable Web Analytics** butonuna tıkla
3. Performance metriklerini takip et

### Error Tracking (Gelecekte)

Sentry veya benzeri bir servis ekleyebilirsiniz:
- Production hatalarını takip etmek için
- User feedback toplamak için
- Performance monitoring için

---

## 🎉 Başarılı Deployment!

Eğer tüm adımları tamamladıysanız, website'iniz yayında!

**URL:** `https://your-app-name.vercel.app`

**Sonraki Adımlar:**
1. İlk admin kullanıcı oluşturun (Supabase Dashboard'dan)
2. İlk property'leri ekleyin
3. Analytics ekleyin (opsiyonel)
4. Email service ekleyin (opsiyonel)

---

**Sorularınız varsa:** GitHub Issues açın veya dokümantasyona bakın.


# ✅ Vercel Sentry DSN Kurulumu

## Environment Variable Ekleme

### Vercel Dashboard'a Git:
1. https://vercel.com/dashboard
2. **EstateBali** projesini seç
3. **Settings** → **Environment Variables**
4. **"Add New"** butonuna tıkla

### Eklenmesi Gereken:
```
Key: NEXT_PUBLIC_SENTRY_DSN
Value: https://a7080ae41a4338e73c3b9be22d80700a@o4510567927578624.ingest.us.sentry.io/4510647298621440
Environment: ✅ Production, ✅ Preview
```

### Sonra:
1. **Save** butonuna tıkla
2. **Redeploy** yap (son deployment'ı yeniden deploy et)

---

## ✅ Local Development (.env.local)

Local development için `.env.local` dosyasına eklendi:
```
NEXT_PUBLIC_SENTRY_DSN=https://a7080ae41a4338e73c3b9be22d80700a@o4510567927578624.ingest.us.sentry.io/4510647298621440
```

---

## 🧪 Test Etme

### Local'de Test:
1. `npm run dev`
2. `http://localhost:3000/test-sentry` sayfasına git
3. Test butonlarına tıkla
4. Sentry Dashboard'da kontrol et: https://sentry.io/organizations/estate-bali/projects/javascript-nextjs/issues/

### Production'da Test:
1. Vercel'e deploy et
2. `https://estatebali.app/test-sentry` sayfasına git
3. Test butonlarına tıkla
4. Sentry Dashboard'da kontrol et

---

## 📊 Vercel Log Drain Entegrasyonu (Opsiyonel ama Önerilen)

Vercel'in server-side loglarını Sentry'ye göndermek için Log Drain ekle:

### Adımlar:
1. **Vercel Dashboard** → **Project Settings** → **Log Drains**
2. **"Create Log Drain"** butonuna tıkla
3. **Endpoint URL:** Aşağıdaki URL'i yapıştır:
   ```
   https://o4510567927578624.ingest.us.sentry.io/api/4510647298621440/integration/vercel/logs
   ```
4. **Sources:** Tüm log tiplerini seç (veya istediğin log tiplerini)
5. **Save** butonuna tıkla

### Ne İşe Yarar?
- Vercel server-side loglarını Sentry'ye gönderir
- API route hatalarını Sentry'de görürsün
- Production'daki tüm logları merkezi bir yerde toplar

---

## 📋 Checklist

- [x] DSN bulundu
- [x] Local `.env.local` dosyasına eklendi
- [ ] Vercel'e environment variable eklendi (`NEXT_PUBLIC_SENTRY_DSN`)
- [ ] Vercel Log Drain eklendi (opsiyonel)
- [ ] Vercel'de redeploy yapıldı
- [ ] Test sayfasında test edildi
- [ ] Sentry Dashboard'da hatalar görünüyor

---

## 🔗 Faydalı Linkler

- **Sentry Dashboard:** https://sentry.io/organizations/estate-bali/projects/javascript-nextjs/
- **Test Sayfası:** https://estatebali.app/test-sentry
- **Vercel Dashboard:** https://vercel.com/dashboard

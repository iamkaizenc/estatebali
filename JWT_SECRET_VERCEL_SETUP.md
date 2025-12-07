# 🔐 JWT_SECRET Vercel Setup

## JWT_SECRET Değeri

```
JWT_SECRET=a7f3e9d2c8b5a1f4e6d9c2b8a5f3e7d1c4b9a2f6e8d3c7b1a9f4e2d6c8b5a3f7
```

**Uzunluk:** 64 karakter ✅ (Minimum 32 karakter gereklidir)

## Vercel'de Environment Variable Ekleme

### Adım 1: Vercel Dashboard'a Git
1. [Vercel Dashboard](https://vercel.com/dashboard)
2. **estatebali** projesine tıkla
3. **Settings** → **Environment Variables**

### Adım 2: JWT_SECRET Ekle

1. **Add New** butonuna tıkla
2. Şu bilgileri gir:
   - **Key:** `JWT_SECRET`
   - **Value:** `a7f3e9d2c8b5a1f4e6d9c2b8a5f3e7d1c4b9a2f6e8d3c7b1a9f4e2d6c8b5a3f7`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
3. **Save** butonuna tıkla

### Adım 3: Deployment'ı Yeniden Başlat

1. **Deployments** tab'ına git
2. Son deployment'ın yanındaki **"..."** menüsünden **"Redeploy"** seç
3. Veya yeni bir commit push'la (otomatik deploy edilir)

## ✅ Kontrol

Deployment başarılı olduktan sonra:
- JWT_SECRET hatası çözülmüş olmalı
- Authentication çalışmalı
- Build başarılı olmalı

## 📝 Not

Bu değer local development için `.env.local` dosyasına eklendi (git'e commit edilmez).

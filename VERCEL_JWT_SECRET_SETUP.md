# ⚠️ KRİTİK: Vercel'de JWT_SECRET Ekleme

## Sorun

Site çalışmıyor çünkü `JWT_SECRET` environment variable Vercel'de ayarlanmamış.

## Hızlı Çözüm

### Adım 1: Vercel Dashboard'a Git

1. [Vercel Dashboard](https://vercel.com/dashboard) aç
2. **estatebali** projesine tıkla
3. **Settings** → **Environment Variables**

### Adım 2: JWT_SECRET Ekle

**Variable Name:**
```
JWT_SECRET
```

**Value:**
```
a7f3e9d2c8b5a1f4e6d9c2b8a5f3e7d1c4b9a2f6e8d3c7b1a9f4e2d6c8b5a3f7
```

**Environment:**
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

### Adım 3: Save & Redeploy

1. **Save** butonuna tıkla
2. **Deployments** tab'ına git
3. Son deployment'ın yanındaki **"..."** menüsünden **"Redeploy"** seç

## Doğrulama

Deployment tamamlandıktan sonra:
1. Site açılıyor mu?
2. Login çalışıyor mu?
3. Browser console'da JWT_SECRET hatası var mı? (olmamalı)

## Notlar

- JWT_SECRET en az 32 karakter olmalı (bizimki 64 karakter ✅)
- JWT_SECRET asla client-side'da kullanılmamalı (artık düzeltildi ✅)
- Production, Preview ve Development için aynı değeri kullanabilirsin


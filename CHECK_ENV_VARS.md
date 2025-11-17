# 🔍 Environment Variables Kontrol Rehberi

## ❌ Hata: "Authentication service is not configured"

Bu hata, Vercel'de `SUPABASE_SERVICE_ROLE_KEY` environment variable'ının eksik veya yanlış olduğunu gösterir.

## ✅ Çözüm: Vercel'de Environment Variables Kontrolü

### Adım 1: Vercel Dashboard'a Git

1. [Vercel Dashboard](https://vercel.com/dashboard)
2. **estatebali** projesine tıkla
3. **Settings** → **Environment Variables**

### Adım 2: Şu Variable'ları Kontrol Et

Aşağıdaki 3 variable'ın **HEPSİ** olmalı:

| Variable Name | Örnek Değer | Gerekli mi? |
|--------------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hfsdvopvsttqcildsyvi.supabase.co` | ✅ Evet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Evet |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Evet |

### Adım 3: Eksik Variable'ı Ekle

Eğer `SUPABASE_SERVICE_ROLE_KEY` yoksa:

1. **Supabase Dashboard** → Projeniz → **Settings** → **API**
2. **Project API keys** bölümünde:
   - **`service_role` `secret`** key'i kopyalayın
3. **Vercel** → **Settings** → **Environment Variables**
4. **Add New** butonuna tıklayın
5. Şunları girin:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (Supabase'den kopyaladığınız service_role key)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. **Save**

### Adım 4: Variable İsimlerini Kontrol Et

**ÖNEMLİ:** Variable isimleri **TAM OLARAK** şöyle olmalı:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` (NEXT_PUBLIC_ ile başlamalı)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (NEXT_PUBLIC_ ile başlamalı)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (NEXT_PUBLIC_ OLMAMALI - server-side only)

**YANLIŞ İSİMLER:**
- ❌ `SUPABASE_URL` → ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY` → ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` → ✅ `SUPABASE_SERVICE_ROLE_KEY`

### Adım 5: Redeploy

1. **Deployments** tab'ına git
2. Son deployment'ın yanındaki **"..."** → **"Redeploy"**
3. Veya yeni bir commit push et

## 🔍 Supabase Keys Nasıl Bulunur?

1. [Supabase Dashboard](https://app.supabase.com) → Projeniz
2. Sol menüden **Settings** (⚙️) → **API**
3. **Project API keys** bölümünde:
   - **`anon` `public`** → Bu `NEXT_PUBLIC_SUPABASE_ANON_KEY` olacak
   - **`service_role` `secret`** → Bu `SUPABASE_SERVICE_ROLE_KEY` olacak

**⚠️ ÖNEMLİ:** 
- `service_role` key'i **ASLA** client-side'da kullanılmamalı
- Sadece server-side (API routes) için kullanılır
- Bu yüzden `NEXT_PUBLIC_` prefix'i **YOK**

## ✅ Kontrol

Environment variable'ları ekledikten sonra:

1. **Redeploy** yapın
2. **Login** sayfasına gidin
3. Artık çalışmalı! ✅

## 🐛 Hala Çalışmıyorsa

1. **Vercel Function Logs** kontrol edin:
   - Vercel Dashboard → **Deployments** → Son deployment → **Function Logs**
   - Hata mesajlarını kontrol edin

2. **Browser Console** kontrol edin (F12)

3. **Environment Variables** tekrar kontrol edin:
   - İsimler doğru mu?
   - Değerler doğru mu?
   - Tüm environments (Production, Preview, Development) seçili mi?

---

**Sorun devam ederse:** Vercel Function Logs'u paylaşın, birlikte çözelim.


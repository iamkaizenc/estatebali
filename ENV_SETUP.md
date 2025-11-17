# 🔧 Environment Variables Kurulum Rehberi

## ⚠️ Hata: "Supabase is not configured"

Bu hata, Vercel'de Supabase environment variable'larının eksik olduğunu gösterir.

## 📋 Gerekli Environment Variables

### 1. Supabase Credentials

**Supabase Dashboard'dan alın:**
1. [Supabase Dashboard](https://app.supabase.com) → Projeniz (`hfsdvopvsttqcildsyvi`)
2. **Settings** → **API**
3. Şu bilgileri kopyalayın:
   - **Project URL**: `https://hfsdvopvsttqcildsyvi.supabase.co`
   - **anon/public key**: (Settings → API → Project API keys → `anon` `public`)
   - **service_role key**: (Zaten var: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Vercel'de Environment Variables Ekleme

**Adım 1: Vercel Dashboard'a Git**
1. [Vercel Dashboard](https://vercel.com/dashboard)
2. **estatebali** projesine tıkla
3. **Settings** → **Environment Variables**

**Adım 2: Aşağıdaki Variable'ları Ekleyin**

Her birini ayrı ayrı ekleyin:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://hfsdvopvsttqcildsyvi.supabase.co`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** (Supabase Dashboard'dan `anon` `public` key'i kopyalayın)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 3:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyNDE0MiwiZXhwIjoyMDc4NjAwMTQyfQ.MrTnfmH8AOzOymO8QRqvKpE30Ra2_bQSS6z_pMJmav4`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

#### Variable 4 (Opsiyonel ama önerilen):
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://estatebali.vercel.app` (veya production URL'iniz)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

**Adım 3: Deploy Yeniden Başlat**
1. **Deployments** tab'ına git
2. Son deployment'ın yanındaki **"..."** menüsünden **"Redeploy"** seç
3. Veya yeni bir commit push edin

## 🔍 Supabase Anon Key Nasıl Bulunur?

1. [Supabase Dashboard](https://app.supabase.com) → Projeniz
2. Sol menüden **Settings** (⚙️) → **API**
3. **Project API keys** bölümünde:
   - **`anon` `public`** key'i kopyalayın (bu `NEXT_PUBLIC_SUPABASE_ANON_KEY` olacak)
   - **`service_role` `secret`** key'i kopyalayın (bu `SUPABASE_SERVICE_ROLE_KEY` olacak)

**⚠️ Önemli:** 
- `anon` key'i **public** olabilir (client-side'da kullanılır)
- `service_role` key'i **ASLA** client-side'da kullanılmamalı (sadece server-side)

## ✅ Kontrol

Environment variable'ları ekledikten sonra:

1. **Vercel Dashboard** → **Deployments** → Son deployment
2. **Function Logs** bölümünü kontrol edin
3. Artık "Supabase is not configured" hatası görünmemeli

## 🧪 Test

1. Website'i açın: `https://estatebali.vercel.app`
2. **Register** sayfasına gidin
3. Yeni bir hesap oluşturmayı deneyin
4. Artık çalışmalı! ✅

---

**Sorun devam ederse:**
- Vercel Function Logs'u kontrol edin
- Browser Console'u kontrol edin (F12)
- Supabase Dashboard'da API keys'in doğru olduğundan emin olun


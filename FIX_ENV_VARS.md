# 🔧 Environment Variable İsimlerini Düzeltme

## ❌ Sorun

Vercel'de environment variable'lar yanlış isimlerle eklenmiş:

- ❌ `SUPABASE_URL` → ✅ `NEXT_PUBLIC_SUPABASE_URL` olmalı
- ❌ `SUPABASE_ANON_KEY` → ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` olmalı
- ✅ `SUPABASE_SERVICE_ROLE_KEY` → Bu doğru (server-side için)
- ❌ `EXPO_PUBLIC_APP_URL` → ✅ `NEXT_PUBLIC_APP_URL` olmalı (web için)

## ✅ Çözüm: Vercel'de Düzeltme

### Adım 1: Mevcut Variable'ları Düzenle

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Her variable'ın yanındaki **"..."** menüsüne tıklayın
3. **"Edit"** seçin
4. İsmi düzeltin:

#### Variable 1: `SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
- **Eski isim:** `SUPABASE_URL`
- **Yeni isim:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Aynı kalacak (değeri kopyalayın)
- **Environments:** ✅ All

#### Variable 2: `SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Eski isim:** `SUPABASE_ANON_KEY`
- **Yeni isim:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Aynı kalacak (değeri kopyalayın)
- **Environments:** ✅ All

#### Variable 3: `EXPO_PUBLIC_APP_URL` → `NEXT_PUBLIC_APP_URL` (opsiyonel)
- **Eski isim:** `EXPO_PUBLIC_APP_URL`
- **Yeni isim:** `NEXT_PUBLIC_APP_URL`
- **Value:** Aynı kalacak (ör: `https://estatebali.vercel.app`)
- **Environments:** ✅ All

#### Variable 4: `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Bu zaten doğru, değiştirmeyin!

### Adım 2: Eski Variable'ları Sil

Düzeltme yaptıktan sonra eski isimlerle kalan variable'ları silin:
- `SUPABASE_URL` (artık `NEXT_PUBLIC_SUPABASE_URL` var)
- `SUPABASE_ANON_KEY` (artık `NEXT_PUBLIC_SUPABASE_ANON_KEY` var)
- `EXPO_PUBLIC_APP_URL` (artık `NEXT_PUBLIC_APP_URL` var, eğer web için kullanıyorsanız)

### Adım 3: Redeploy

1. **Deployments** tab'ına gidin
2. Son deployment'ın yanındaki **"..."** → **"Redeploy"**
3. Veya yeni bir commit push edin

## 📋 Son Durum (Doğru)

Vercel'de şu variable'lar olmalı:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hfsdvopvsttqcildsyvi.supabase.co` | ✅ All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) | ✅ All |
| `SUPABASE_SERVICE_ROLE_KEY` | (service role key) | ✅ All |
| `NEXT_PUBLIC_APP_URL` | `https://estatebali.vercel.app` | ✅ All (opsiyonel) |

## 🔍 Neden `NEXT_PUBLIC_` Prefix'i Gerekli?

Next.js'de:
- **Client-side** (browser'da çalışan kod): `NEXT_PUBLIC_` prefix'i olan variable'lar erişilebilir
- **Server-side** (API routes, server components): Tüm variable'lar erişilebilir

Kodumuzda `src/lib/supabase.ts` dosyasında:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // ✅ NEXT_PUBLIC_ gerekli
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // ✅ NEXT_PUBLIC_ gerekli
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ NEXT_PUBLIC_ gerekmez (sadece server-side)
```

## ✅ Kontrol

Düzeltme yaptıktan sonra:
1. Website'i açın
2. Register sayfasına gidin
3. Artık "Supabase is not configured" hatası görünmemeli! ✅


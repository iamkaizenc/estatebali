# 🔧 Vercel Environment Variable Sorunu Çözümü

## ✅ Değer Doğru
`SUPABASE_SERVICE_ROLE_KEY` değeri doğru görünüyor. Sorun muhtemelen Vercel'de environment variable'ların yüklenmemesi.

## 🔍 Kontrol Listesi

### 1. Environment Seçimi
Vercel'de her variable için **TÜM** environment'lar seçili olmalı:

- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

**Kontrol:**
1. Vercel Dashboard → Settings → Environment Variables
2. Her variable'ın yanındaki environment'ları kontrol et
3. Eğer sadece Production seçiliyse, Preview/Development'da çalışmaz

### 2. Variable İsimleri
**Kesinlikle şöyle olmalı:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (NEXT_PUBLIC_ OLMAMALI!)

**YANLIŞ:**
- ❌ `SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY`
- ❌ `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

### 3. Değerlerin Boş Olmaması
Her variable'ın yanındaki **göz ikonuna** tıklayarak değerlerin gerçekten dolu olduğundan emin ol.

### 4. Redeploy
Environment variable'lar değiştiğinde **MUTLAKA** redeploy yapılmalı:

1. **Deployments** → Son deployment → **"..."** → **"Redeploy"**
2. Veya yeni bir commit push et

## 🚨 Önemli: Vercel'de Server-Side Env Vars

Next.js'de `NEXT_PUBLIC_` prefix'i **OLMAYAN** environment variable'lar:
- Sadece **server-side** (API routes, server components) kullanılabilir
- **Build-time**'da yüklenir
- Vercel'de bazen **runtime**'da yüklenmeyebilir

**Çözüm:** Redeploy yapmak genellikle sorunu çözer.

## ✅ Test Adımları

### 1. Redeploy Yap
```
Deployments → Son deployment → "..." → "Redeploy"
```

### 2. Test Endpoint'ini Kontrol Et
```
https://estatebali.vercel.app/api/test-env
```

Bu endpoint şunları gösterecek:
- Hangi variable'lar var
- Supabase connection test sonucu

### 3. Function Logs'u Kontrol Et
1. Vercel Dashboard → Deployments → Son deployment
2. **Function Logs** sekmesine git
3. Login denemesi yap
4. Loglarda şu mesajları ara:
   ```
   [Supabase Init] Environment Check:
   [Supabase Admin] ❌ ERROR: ...
   ```

## 🔍 Olası Sorun: Vercel Build Cache

Bazen Vercel build cache'i environment variable'ları eski tutabilir.

**Çözüm:**
1. Vercel Dashboard → Settings → General
2. **Clear Build Cache** butonuna tıkla (varsa)
3. Veya yeni bir commit push et

## 📋 Son Kontrol

Vercel'de şu 3 variable'ın **HEPSİ** olmalı ve **TÜM** environment'larda seçili olmalı:

| Variable | Değer Örneği | Environments |
|----------|--------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hfsdvopvsttqcildsyvi.supabase.co` | ✅ All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ All |

---

**Redeploy yaptıktan sonra test endpoint'ini kontrol et ve Function Logs'u paylaş!**


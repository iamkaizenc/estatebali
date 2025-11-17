# 🔍 Login Hatası Debug Rehberi

## ❌ Hata: "Authentication service is not configured"

Bu hata, `supabaseAdmin` client'ının null olduğunu gösterir.

## ✅ Kontrol Adımları

### 1. Vercel Function Logs Kontrolü

1. **Vercel Dashboard** → **estatebali** projesi
2. **Deployments** → Son deployment'a tıkla
3. **Function Logs** sekmesine git
4. Login denemesi yap
5. Loglarda şu mesajı ara:
   ```
   Supabase Admin Client Error: {
     hasUrl: true/false,
     hasServiceKey: true/false,
     missingVars: [...]
   }
   ```

### 2. Test Endpoint'i Kullan

Deploy sonrası şu URL'yi aç:
```
https://estatebali.vercel.app/api/test-env
```

Bu endpoint şunları gösterir:
- Hangi environment variable'lar var
- Supabase connection test sonucu

### 3. Environment Variable Değerlerini Kontrol Et

Vercel'de her variable'ın yanındaki **göz ikonuna** tıklayarak değerlerin gerçekten dolu olduğundan emin ol:

- `NEXT_PUBLIC_SUPABASE_URL` → `https://hfsdvopvsttqcildsyvi.supabase.co` olmalı
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Uzun bir JWT token olmalı
- `SUPABASE_SERVICE_ROLE_KEY` → Uzun bir JWT token olmalı

### 4. Redeploy Yap

Environment variable'lar değiştiğinde **MUTLAKA** redeploy yapılmalı:

1. **Deployments** → Son deployment → **"..."** → **"Redeploy"**
2. Veya yeni bir commit push et

## 🔍 Olası Sorunlar

### Sorun 1: Değerler Boş String
- Variable var ama değeri boş olabilir
- Göz ikonuna tıklayarak kontrol et

### Sorun 2: Environment Seçimi
- Her variable için **Production, Preview, Development** seçili olmalı
- Sadece Production seçiliyse, Preview/Development'da çalışmaz

### Sorun 3: Variable İsimleri Yanlış
- `SUPABASE_URL` ❌ → `NEXT_PUBLIC_SUPABASE_URL` ✅
- `SUPABASE_ANON_KEY` ❌ → `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` ❌ → `SUPABASE_SERVICE_ROLE_KEY` ✅

### Sorun 4: Cache
- Vercel cache'i temizlemek için redeploy yap

## ✅ Hızlı Test

1. **Redeploy yap**
2. **Test endpoint'ini aç:** `https://estatebali.vercel.app/api/test-env`
3. **Function Logs'u kontrol et**
4. **Login denemesi yap**

## 📋 Not

`verified: false` olması **login'i engellemez**. Login fonksiyonunda `verified` kontrolü yok.

Sorun muhtemelen:
- Environment variable'ların yüklenmemesi
- Veya değerlerin yanlış olması

---

**Function Logs sonuçlarını paylaş, birlikte çözelim!**


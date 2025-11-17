# 🔧 Vercel SUPABASE_SERVICE_ROLE_KEY Sorunu - Kesin Çözüm

## ❌ Sorun
Variable Vercel'de var ama runtime'da yüklenmiyor. Bu Vercel'de bilinen bir sorun.

## ✅ Çözüm: Variable'ı Silip Yeniden Ekle

### Adım 1: Mevcut Variable'ı Sil
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. `SUPABASE_SERVICE_ROLE_KEY` variable'ını bul
3. Yanındaki **"..."** → **"Delete"**
4. Onayla

### Adım 2: Yeniden Ekle
1. **"Add New"** butonuna tıkla
2. Şunları gir:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc2R2b3B2c3R0cWNpbGRzeXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyNDE0MiwiZXhwIjoyMDc4NjAwMTQyfQ.MrTnfmH8AOzOymO8QRqvKpE30Ra2_bQSS6z_pMJmav4`
   - **Environments:** ✅ **Production**, ✅ **Preview**, ✅ **Development** (HEPSİNİ SEÇ!)
3. **Save**

### Adım 3: Redeploy
1. **Deployments** → Son deployment → **"..."** → **"Redeploy"**
2. Veya yeni bir commit push et

## 🔍 Alternatif: Vercel CLI ile Kontrol

Eğer Vercel CLI kuruluysa:

```bash
vercel env ls
```

Bu, tüm environment variable'ları gösterir.

## ✅ Test

Deploy sonrası:

1. **Test endpoint:** `https://estatebali.vercel.app/api/test-env`
   - Bu endpoint artık tüm SUPABASE env var'larını gösterecek
   
2. **Function Logs:** Vercel Dashboard → Deployments → Function Logs
   - `[Supabase Init] Environment Check:` mesajını ara
   - `hasServiceKey: true` olmalı

## 🚨 Önemli Notlar

1. **Environment Seçimi:** Variable'ı eklerken **MUTLAKA** Production, Preview, Development'ın **HEPSİNİ** seç
2. **Redeploy:** Variable ekledikten sonra **MUTLAKA** redeploy yap
3. **Variable İsmi:** `SUPABASE_SERVICE_ROLE_KEY` (NEXT_PUBLIC_ OLMAMALI!)

## 📋 Kontrol Listesi

- [ ] Variable silindi
- [ ] Variable yeniden eklendi (tüm environment'larda)
- [ ] Redeploy yapıldı
- [ ] Test endpoint kontrol edildi
- [ ] Function Logs kontrol edildi

---

**Variable'ı silip yeniden ekledikten ve redeploy yaptıktan sonra test edin!**


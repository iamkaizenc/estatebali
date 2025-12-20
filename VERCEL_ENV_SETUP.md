# 🚀 Vercel Environment Variables - Hızlı Kurulum

**Resend API Key:** `re_CEgdN8t3_DP7nU79QfcGqubDWFMa9cvad` ✅

---

## ⚡ 3 Adımda Kurulum

### 1️⃣ Vercel Dashboard'a Git
https://vercel.com/dashboard → Projeni seç → **Settings** → **Environment Variables**

### 2️⃣ Şu 3 Variable'ı Ekle:

#### `RESEND_API_KEY`
- **Name:** `RESEND_API_KEY`
- **Value:** `re_CEgdN8t3_DP7nU79QfcGqubDWFMa9cvad`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development (HEPSİNİ SEÇ!)

#### `FROM_EMAIL`
- **Name:** `FROM_EMAIL`
- **Value:** `onboarding@resend.dev` (Development için - domain verify gerekmez)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development (HEPSİNİ SEÇ!)

#### `NEXT_PUBLIC_APP_URL` (Kontrol Et - Zaten varsa dokunma)
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://estatebali.app`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 3️⃣ Redeploy
- Son deployment → **"..."** → **"Redeploy"**
- VEYA yeni bir commit push et

---

## ✅ Test Et

### Email Servis Durumu:
```bash
curl https://estatebali.app/api/test-email
```

**Beklenen:**
```json
{
  "configured": true,
  "service": "Resend",
  "hasFromEmail": true,
  "fromEmail": "onboarding@resend.dev"
}
```

### Test Email Gönder (Admin):
```bash
curl -X POST https://estatebali.app/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"to": "your-email@example.com"}'
```

---

## 🎯 Sonraki Adımlar

1. ✅ Vercel'e env var'ları ekle
2. ✅ Redeploy yap
3. ✅ Test email gönder
4. ✅ Gerçek senaryoları test et (register, forgot-password)

---

**Detaylı rehber:** `EMAIL_INTEGRATION_COMPLETE.md`

# 🚀 Email Service - Hızlı Başlangıç

**Resend API key'in var mı?** ✅ → Hemen başlayalım!

---

## ⚡ 3 Adımda Kurulum

### 1️⃣ Vercel'e Environment Variables Ekle

Vercel Dashboard → Settings → Environment Variables:

```
RESEND_API_KEY = re_xxxxxxxxxxxxx (Resend'den aldığın key)
FROM_EMAIL = onboarding@resend.dev (Development için - domain verify gerekmez)
```

**ÖNEMLİ:** Tüm environment'ları seç (Production, Preview, Development)

### 2️⃣ Redeploy Yap

Vercel Dashboard → Deployments → Son deployment → "..." → "Redeploy"

### 3️⃣ Test Et

```bash
# Email servis durumunu kontrol et
curl https://estatebali.app/api/test-email

# Test email gönder (admin token gerekli)
curl -X POST https://estatebali.app/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"to": "your-email@example.com"}'
```

---

## ✅ Kurulum Tamamlandı mı?

Test email'i aldın mı? ✅ → **Email servisi çalışıyor!**

---

## 🎯 Sonraki Adımlar

### Production için Domain Verify (Opsiyonel ama Önerilir):

1. Resend Dashboard → Domains → Add Domain
2. `estatebali.app` ekle
3. DNS kayıtlarını ekle (SPF, DKIM)
4. Verify et
5. `FROM_EMAIL=noreply@estatebali.app` yap

**Detaylı rehber:** `RESEND_SETUP_COMPLETE.md`

---

## 🧪 Test Senaryoları

### Password Reset Email:
1. `/forgot-password` sayfasına git
2. Email gir
3. Email'in gelip gelmediğini kontrol et

### Welcome Email:
1. Yeni kullanıcı kaydı yap (`/register`)
2. Welcome email'in gelip gelmediğini kontrol et

---

**Sorun mu var?** `RESEND_SETUP_COMPLETE.md` dosyasındaki troubleshooting bölümüne bak! 🔧

# 📧 Resend Email Service - Kurulum Rehberi

**Tarih:** 2025-12-14  
**Durum:** ✅ Resend API key alındı - Kurulum adımları

---

## ✅ Adım 1: Vercel Environment Variables Ekleme

Vercel Dashboard'a gidip environment variables ekle:

### 1. Vercel Dashboard'a Git
1. https://vercel.com/dashboard → Projeni seç
2. **Settings** → **Environment Variables**

### 2. Şu Değişkenleri Ekle:

#### `RESEND_API_KEY`
- **Name:** `RESEND_API_KEY`
- **Value:** Resend dashboard'dan aldığın API key (örn: `re_xxxxxxxxxxxxx`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development (HEPSİNİ SEÇ!)

#### `FROM_EMAIL`
- **Name:** `FROM_EMAIL`
- **Value:** `noreply@estatebali.app` (veya verify ettiğin domain'den bir email)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development (HEPSİNİ SEÇ!)

#### `NEXT_PUBLIC_APP_URL` (Kontrol Et)
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://estatebali.app`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 3. Redeploy
- Variable'ları ekledikten sonra **MUTLAKA** redeploy yap
- Son deployment → **"..."** → **"Redeploy"**

---

## ✅ Adım 2: Domain Verification (Production için)

### Development için (Hızlı Test):
- Resend'in `onboarding@resend.dev` domain'ini kullanabilirsin
- Domain verify etmene gerek yok
- `FROM_EMAIL=onboarding@resend.dev` olarak ayarla

### Production için (estatebali.app):
1. **Resend Dashboard** → **Domains** → **Add Domain**
2. Domain: `estatebali.app`
3. DNS kayıtlarını ekle (Resend sana verecek):
   - **SPF Record**
   - **DKIM Records** (3 adet)
   - **DMARC Record** (opsiyonel ama önerilir)
4. DNS provider'ında (Namecheap, Cloudflare, vb.) bu kayıtları ekle
5. Resend'de **"Verify"** butonuna tıkla
6. Verification tamamlanana kadar bekle (genellikle birkaç dakika)

---

## ✅ Adım 3: Test Email Gönderme

### Yöntem 1: Admin Panel Üzerinden (Önerilen)
1. Admin olarak giriş yap
2. API endpoint'i test et:
   ```bash
   curl -X POST https://estatebali.app/api/test-email \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{"to": "your-email@example.com", "testType": "simple"}'
   ```

### Yöntem 2: Email Service Status Kontrolü
```bash
curl https://estatebali.app/api/test-email
```

Response:
```json
{
  "configured": true,
  "service": "Resend",
  "hasFromEmail": true,
  "fromEmail": "noreply@estatebali.app",
  "resendKeyLength": 51,
  "resendKeyPreview": "re_1234567..."
}
```

### Yöntem 3: Gerçek Kullanım Senaryoları

#### Password Reset Email Test:
1. `/forgot-password` sayfasına git
2. Email gir
3. Email'in gelip gelmediğini kontrol et

#### Welcome Email Test:
1. Yeni kullanıcı kaydı yap (`/register`)
2. Welcome email'in gelip gelmediğini kontrol et

---

## 🔍 Troubleshooting

### Problem: "Email service not configured"
**Çözüm:**
- Vercel'de `RESEND_API_KEY` var mı kontrol et
- Redeploy yaptın mı?
- Environment variable'ı tüm environment'larda (Production, Preview, Development) ekledin mi?

### Problem: "Domain not verified"
**Çözüm:**
- Development için: `FROM_EMAIL=onboarding@resend.dev` kullan
- Production için: Domain'i Resend'de verify et
- DNS kayıtlarının doğru eklendiğinden emin ol

### Problem: Email gelmiyor
**Kontrol Listesi:**
1. ✅ Resend API key doğru mu?
2. ✅ FROM_EMAIL ayarlı mı?
3. ✅ Domain verify edildi mi? (production için)
4. ✅ Spam klasörünü kontrol ettin mi?
5. ✅ Resend dashboard'da email gönderildi mi? (Logs'a bak)

### Problem: "Invalid API key"
**Çözüm:**
- Resend dashboard'dan yeni API key oluştur
- Vercel'de eski key'i sil, yenisini ekle
- Redeploy yap

---

## 📋 Environment Variables Checklist

Vercel'de şunlar olmalı:

- [ ] `RESEND_API_KEY` = `re_...` (Resend API key)
- [ ] `FROM_EMAIL` = `noreply@estatebali.app` (veya `onboarding@resend.dev` development için)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://estatebali.app`
- [ ] Tüm variable'lar **Production, Preview, Development** environment'larında mevcut

---

## 🧪 Test Senaryoları

### 1. Basit Test Email
```bash
POST /api/test-email
{
  "to": "your-email@example.com",
  "testType": "simple"
}
```

### 2. Welcome Email Test
```bash
POST /api/test-email
{
  "to": "your-email@example.com",
  "testType": "welcome"
}
```

### 3. Password Reset Email Test
```bash
POST /api/test-email
{
  "to": "your-email@example.com",
  "testType": "password-reset"
}
```

### 4. Custom Email Test
```bash
POST /api/test-email
{
  "to": "your-email@example.com",
  "testType": "custom",
  "subject": "Test Subject",
  "html": "<h1>Test</h1>",
  "text": "Test"
}
```

---

## 📊 Email Service Status

Email servisinin durumunu kontrol et:
```bash
GET /api/test-email
```

Bu endpoint authentication gerektirmez ve sadece configuration durumunu gösterir.

---

## ✅ Kurulum Tamamlandı mı?

Kurulum tamamlandığında:
1. ✅ Vercel'de environment variables eklendi
2. ✅ Redeploy yapıldı
3. ✅ Test email gönderildi ve alındı
4. ✅ Password reset email çalışıyor
5. ✅ Welcome email çalışıyor

---

## 🚀 Sonraki Adımlar

1. **Domain Verification** (Production için):
   - estatebali.app domain'ini Resend'de verify et
   - DNS kayıtlarını ekle
   - `FROM_EMAIL=noreply@estatebali.app` yap

2. **Email Templates İyileştirme** (Opsiyonel):
   - HTML email template'lerini özelleştir
   - Branding ekle
   - Responsive design

3. **Email Analytics** (Opsiyonel):
   - Resend dashboard'da email analytics'i takip et
   - Open rates, click rates, vb.

---

**Soruların varsa veya bir sorunla karşılaşırsan, bana haber ver!** 🚀

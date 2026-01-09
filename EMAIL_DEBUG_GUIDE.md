# 📧 Email Servisi Debug Rehberi

## 🔍 Sorun: Email Alınamıyor / Gönderilmiyor

### 1. Environment Variables Kontrolü

**Vercel Dashboard'da kontrol et:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Şu değişkenlerin olması gerekiyor:
   - `RESEND_API_KEY` ✅ (Zorunlu)
   - `FROM_EMAIL` ✅ (Zorunlu - örn: `noreply@estatebali.app` veya `onboarding@resend.dev`)

### 2. Test Email Endpoint'i Kullan

**Test email gönder:**
```bash
curl -X POST https://estatebali.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com", "subject": "Test", "message": "Test mesajı"}'
```

Veya browser console'dan:
```javascript
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'your-email@example.com',
    subject: 'Test Email',
    message: 'Bu bir test emailidir'
  })
})
.then(r => r.json())
.then(console.log);
```

### 3. Vercel Logs Kontrolü

**Vercel Dashboard → Deployments → Son deployment → Functions → Logs**

Arayacağın hatalar:
- `No email provider configured`
- `Resend API error`
- `Email service not configured`
- `403` veya `401` status codes

### 4. Resend Dashboard Kontrolü

1. **Resend Dashboard:** https://resend.com/emails
2. **API Keys:** https://resend.com/api-keys
3. **Domains:** https://resend.com/domains
   - Domain verify edilmiş mi?
   - `estatebali.app` domain'i eklenmiş mi?

### 5. FROM_EMAIL Formatı

**Doğru formatlar:**
```
noreply@estatebali.app
onboarding@resend.dev
EstateBali <noreply@estatebali.app>
```

**Yanlış formatlar:**
```
EstateBali noreply@estatebali.app  (eksik < >)
<noreply@estatebali.app>          (eksik isim)
```

### 6. Hızlı Kontrol Listesi

- [ ] `RESEND_API_KEY` Vercel'de var mı?
- [ ] `FROM_EMAIL` Vercel'de var mı?
- [ ] Environment: Production seçili mi?
- [ ] Son deployment'tan sonra redeploy yapıldı mı?
- [ ] Resend API key aktif mi?
- [ ] Domain verify edilmiş mi? (production için)

### 7. Yaygın Hatalar ve Çözümleri

#### Hata: "No email provider configured"
**Çözüm:** `RESEND_API_KEY` Vercel'e eklenmemiş

#### Hata: "403 - Domain not verified"
**Çözüm:** 
- Development: `FROM_EMAIL` olarak `onboarding@resend.dev` kullan
- Production: Resend Dashboard'da domain'i verify et

#### Hata: "401 - Unauthorized"
**Çözüm:** `RESEND_API_KEY` yanlış veya expire olmuş

#### Email gelmiyor ama hata yok
**Çözüm:**
- Spam klasörünü kontrol et
- Resend Dashboard'da email loglarını kontrol et
- `FROM_EMAIL` doğru mu kontrol et

---

## 🧪 Test Endpoint'i

**URL:** `POST /api/test-email`

**Request:**
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "Test mesajı"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Resend API error (403): Domain not verified",
  "details": "Check RESEND_API_KEY and FROM_EMAIL environment variables"
}
```

---

## 📋 Vercel Environment Variables Checklist

```
✅ RESEND_API_KEY=re_xxxxxxxxxxxxx
✅ FROM_EMAIL=noreply@estatebali.app (veya onboarding@resend.dev)
✅ Environment: Production
✅ Environment: Preview (opsiyonel)
```

---

## 🔗 Faydalı Linkler

- **Resend Dashboard:** https://resend.com/emails
- **Resend API Keys:** https://resend.com/api-keys
- **Resend Domains:** https://resend.com/domains
- **Vercel Environment Variables:** https://vercel.com/dashboard → Project → Settings → Environment Variables

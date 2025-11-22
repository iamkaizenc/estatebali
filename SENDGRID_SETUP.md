# SendGrid Email Service - Kurulum Rehberi

## ✅ Tamamlanan Kurulumlar

### 1. API Key Yapılandırması
SendGrid API anahtarınız `.env` dosyasına eklendi:
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
```
**Not:** Gerçek API key `.env` dosyasında güvenle saklanıyor (git'e commit edilmez)

### 2. Email Service Entegrasyonu
`src/lib/email.ts` dosyasında SendGrid tam desteği mevcut:
- ✅ SendGridProvider class implementasyonu
- ✅ Otomatik provider seçimi (SendGrid aktif)
- ✅ Professional HTML email template'leri
- ✅ Password reset email
- ✅ Welcome email
- ✅ Hata yönetimi ve logging

### 3. API Endpoint'leri
Email servisi şu endpoint'lerde kullanılıyor:
- `/api/auth/register` - Yeni kullanıcılara welcome email
- `/api/auth/forgot-password` - Password reset email

## ⚠️ ÖNEMLİ: Sender Email Verification

SendGrid API'nin çalışması için **sender email adresinin verify edilmesi gerekiyor**.

### Adımlar:

1. **SendGrid Dashboard'a giriş yapın:**
   https://app.sendgrid.com/

2. **Sender Authentication sayfasına gidin:**
   https://app.sendgrid.com/settings/sender_auth/senders

3. **"Create New Sender" veya "Verify Single Sender"** butonuna tıklayın

4. **Aşağıdaki bilgileri girin:**
   ```
   From Name: EstateBali
   From Email Address: noreply@estatebali.com
   Reply To: (optional) support@estatebali.com
   Company Address: (your business address)
   ```

5. **Verification email'i onaylayın:**
   - SendGrid, noreply@estatebali.com adresine bir doğrulama emaili gönderecek
   - Email'deki linke tıklayarak doğrulama yapın

6. **Status "Verified" olana kadar bekleyin**

## 🧪 Test Etme

### Opsiyon 1: Production Ortamında Test
Projeyi deploy ettikten sonra:
```bash
# Yeni kullanıcı kaydı
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Welcome email otomatik gönderilecek
```

### Opsiyon 2: Development Ortamında Test
```bash
# Development server başlat
npm run dev

# Tarayıcıda register sayfasını aç
http://localhost:3000/register

# Yeni kullanıcı oluştur
# Email otomatik gönderilecek
```

### Opsiyon 3: SendGrid Dashboard'dan Test
1. SendGrid dashboard → Email API → Integration Guide
2. "Send Your First Email" seçeneğini kullan
3. Test emaili göndererek API key'in çalıştığını doğrula

## 📋 Email Service Kullanımı

### Kod içinde email göndermek:

```typescript
import { sendEmail, emailTemplates } from "@/lib/email";

// Welcome email
const template = emailTemplates.welcomeEmail("John Doe");
await sendEmail({
  to: "user@example.com",
  subject: template.subject,
  html: template.html,
  text: template.text,
});

// Password reset email
const resetTemplate = emailTemplates.passwordReset(
  "https://estatebali.com/reset-password?token=xyz",
  "John Doe"
);
await sendEmail({
  to: "user@example.com",
  subject: resetTemplate.subject,
  html: resetTemplate.html,
  text: resetTemplate.text,
});

// Custom email
await sendEmail({
  to: "user@example.com",
  subject: "Your Subject",
  html: "<h1>Hello!</h1>",
  text: "Hello!",
});
```

## 🔧 Sorun Giderme

### Error 403: Forbidden
**Sebep:** Sender email verify edilmemiş
**Çözüm:** SendGrid dashboard'da noreply@estatebali.com adresini verify edin

### Error 401: Unauthorized
**Sebep:** API key hatalı veya geçersiz
**Çözüm:** `.env` dosyasındaki SENDGRID_API_KEY değerini kontrol edin

### Email gönderilmiyor
**Kontrol listesi:**
1. ✅ SENDGRID_API_KEY .env dosyasında var mı?
2. ✅ Sender email verify edildi mi?
3. ✅ API key "Mail Send" izni var mı?
4. ✅ SendGrid hesabınız aktif mi?

## 📊 Email Gönderim Limitleri

SendGrid free plan limitleri:
- **100 email/gün** (ilk 30 gün için)
- Daha fazla volume için paid plan gerekli

## 🎨 Email Template'leri Özelleştirme

Email template'leri `src/lib/email.ts` dosyasında:

```typescript
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string) => ({ ... }),
  welcomeEmail: (userName: string) => ({ ... }),
  // Yeni template ekleyebilirsiniz
  customTemplate: (data: any) => ({
    subject: 'Your Subject',
    html: '<html>...</html>',
    text: 'Plain text version'
  })
}
```

## ✅ Kurulum Durumu

- [x] SendGrid API key eklendi
- [x] Email service implementasyonu hazır
- [x] Email template'leri oluşturuldu
- [x] API endpoint'lerine entegre edildi
- [ ] **Sender email verification (SİZ YAPACAKSINIZ)**
- [ ] **Production test (Deploy sonrası)**

## 🔗 Faydalı Linkler

- SendGrid Dashboard: https://app.sendgrid.com/
- Sender Verification: https://app.sendgrid.com/settings/sender_auth/senders
- API Keys: https://app.sendgrid.com/settings/api_keys
- SendGrid Docs: https://docs.sendgrid.com/

---

**Hazırlayan:** Claude Code
**Tarih:** 2025-11-22
**Durum:** ✅ Entegrasyon Tamamlandı - Sender Verification Bekleniyor

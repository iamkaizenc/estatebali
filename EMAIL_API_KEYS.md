# 📧 Email API Keys - Durum Raporu

## ✅ Resend API Key

**Dokümanlarda bulunan key:**
```
re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX
```

**Kaynak:** `RESEND_SETUP.md` dosyası

**Durum:** ⚠️ Bu key'in geçerli olup olmadığı kontrol edilmeli

### Kontrol Etmek İçin:
1. [Resend Dashboard](https://resend.com/api-keys) → API Keys sayfasına git
2. Bu key'i kontrol et
3. Eğer yoksa veya geçersizse yeni key oluştur

---

## ❌ SendGrid API Key

**Durum:** Dokümanlarda gerçek SendGrid API key yok

**Sadece placeholder var:**
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

---

## 🚀 Vercel'de Kullanım İçin

### Seçenek 1: Resend Kullan (Önerilen)

Eğer `re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX` key'i geçerliyse:

**Vercel Environment Variables:**
- `RESEND_API_KEY` = `re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX`
- `FROM_EMAIL` = `onboarding@resend.dev` (test için) veya domain'iniz

**Eğer key geçersizse:**

1. [Resend.com](https://resend.com) → Sign Up/Login
2. API Keys → Create API Key
3. Yeni key'i Vercel'e ekle

### Seçenek 2: SendGrid Kullan

1. [SendGrid.com](https://sendgrid.com) → Sign Up/Login
2. API Keys → Create API Key
3. **Vercel Environment Variables:**
   - `SENDGRID_API_KEY` = `SG.your_new_key_here`
   - `FROM_EMAIL` = (verified email address)

---

## ⚠️ ÖNEMLİ NOT

**Test için hızlı çözüm:**

FROM_EMAIL olarak Resend'in test domain'ini kullanabilirsiniz:
```
FROM_EMAIL=onboarding@resend.dev
```

Bu sadece test için çalışır ve sadece doğrulanmış email adreslerinize gönderim yapar.

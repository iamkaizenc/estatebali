# 🚀 Vercel Email Servisi Kurulumu

## ✅ Resend API Key Bulundu

**API Key:** `re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX`

## 📝 Vercel'de Eklenecek Environment Variables

### 1. Resend API Key Ekle

1. [Vercel Dashboard](https://vercel.com/dashboard) → estatebali projesi
2. **Settings** → **Environment Variables**
3. **Add New:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_DmtgKDmy_PHmns5JSVHk2z16iJ2zLdWVX`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
4. **Save**

### 2. FROM_EMAIL Ekle

1. **Add New:**
   - **Key:** `FROM_EMAIL`
   - **Value:** `onboarding@resend.dev` (test için) 
     - VEYA domain'iniz varsa: `noreply@yourdomain.com`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
2. **Save**

## ⚠️ ÖNEMLİ

**Test için hızlı çözüm:**
- `FROM_EMAIL=onboarding@resend.dev` kullanabilirsiniz
- Bu Resend'in test domain'idir
- Sadece doğrulanmış email adreslerinize gönderir

## 🔄 Sonraki Adım

Email servisi eklendikten sonra:
- Yeni bir commit push'layın VEYA
- Vercel Dashboard'dan deployment'ı **Redeploy** edin

## ✅ Kontrol Listesi

- [ ] RESEND_API_KEY eklendi
- [ ] FROM_EMAIL eklendi
- [ ] Deployment redeploy edildi
- [ ] Build başarılı oldu

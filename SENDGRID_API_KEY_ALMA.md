# 📧 SendGrid API Key Nasıl Alınır?

## 🚀 Adım Adım Rehber

### Adım 1: SendGrid Hesabı Oluştur

1. **SendGrid'e git:**
   - https://sendgrid.com
   - VEYA direkt: https://signup.sendgrid.com/

2. **Kayıt Ol:**
   - Email adresinizi girin
   - Şifre oluşturun
   - İsim ve şirket bilgilerinizi girin
   - "Create Account" butonuna tıklayın

3. **Email Doğrulama:**
   - Email'inize gelen doğrulama linkine tıklayın

---

### Adım 2: SendGrid Dashboard'a Giriş

1. **Login:**
   - https://app.sendgrid.com/
   - Email ve şifrenizle giriş yapın

2. **İlk Kurulum:**
   - SendGrid ilk girişte sizden birkaç bilgi isteyebilir
   - Bu bilgileri doldurun (isteğe bağlı)

---

### Adım 3: API Key Oluştur

1. **API Keys Sayfasına Git:**
   - Sol menüden **"Settings"** → **"API Keys"**
   - VEYA direkt: https://app.sendgrid.com/settings/api_keys

2. **"Create API Key" Butonuna Tıkla:**
   - Sağ üstte yeşil buton

3. **API Key Bilgilerini Gir:**
   - **API Key Name:** `Estate Bali Production` (veya istediğiniz isim)
   - **API Key Permissions:** 
     - ✅ **"Full Access"** seçin (tüm özellikler için)
     - VEYA **"Restricted Access"** → **"Mail Send"** seçin (sadece email gönderme)

4. **"Create & View" Butonuna Tıkla**

5. **⚠️ ÖNEMLİ: API Key'i Kopyalayın:**
   - SendGrid size API key'i **sadece bir kez** gösterecek
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **HEMEN KOPYALAYIN!** (Kapatırsanız bir daha göremezsiniz)

---

### Adım 4: Sender Email Doğrulama (ÖNEMLİ!)

SendGrid API çalışması için gönderen email'i doğrulamanız gerekiyor:

1. **Sender Authentication Sayfası:**
   - Sol menüden **"Settings"** → **"Sender Authentication"**
   - VEYA direkt: https://app.sendgrid.com/settings/sender_auth/senders

2. **"Create New Sender" Butonuna Tıkla**

3. **Sender Bilgilerini Gir:**
   ```
   From Name: EstateBali
   From Email Address: noreply@yourdomain.com (veya test email)
   Reply To: (opsiyonel) support@yourdomain.com
   Company Address: (şirket adresiniz)
   Country: (ülke)
   ```

4. **"Create" Butonuna Tıkla**

5. **Email Doğrulama:**
   - SendGrid gönderdiğiniz email adresine doğrulama emaili gönderecek
   - Email'deki linke tıklayarak doğrulayın
   - Durum **"Verified"** olana kadar bekleyin

---

### Adım 5: API Key'i Vercel'e Ekle

1. **Vercel Dashboard:**
   - https://vercel.com/dashboard
   - estatebali projesine tıkla

2. **Environment Variables:**
   - **Settings** → **Environment Variables**

3. **SendGrid API Key Ekle:**
   - **Add New**
   - **Key:** `SENDGRID_API_KEY`
   - **Value:** `SG.your_api_key_here` (Adım 3'te kopyaladığınız key)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Save**

4. **FROM_EMAIL Ekle:**
   - **Add New**
   - **Key:** `FROM_EMAIL`
   - **Value:** Doğruladığınız email (örn: `noreply@yourdomain.com`)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Save**

---

## 🎯 Hızlı Başlangıç (Test İçin)

Eğer hemen test etmek istiyorsanız:

### Test Email Adresi Kullan:

1. **SendGrid'de test sender oluştur:**
   - Kendi email adresinizi (örn: `yourname@gmail.com`) sender olarak ekleyin
   - SendGrid bu adrese doğrulama emaili gönderecek
   - Email'deki linke tıklayarak doğrulayın

2. **FROM_EMAIL olarak kullanın:**
   - `FROM_EMAIL=yourname@gmail.com` (doğrulanmış email)

3. **Sadece bu email adresine gönderim yapabilirsiniz** (test için yeterli)

---

## 📊 SendGrid Free Plan Limitleri

- ✅ **100 email/gün** (ilk 30 gün için)
- ✅ **40,000 email/ay** (ilk 30 günden sonra)
- ✅ Ücretsiz
- ✅ Credit card gerekmez

---

## 🔗 Önemli Linkler

| İşlem | URL |
|-------|-----|
| **Kayıt Ol** | https://signup.sendgrid.com/ |
| **Dashboard** | https://app.sendgrid.com/ |
| **API Keys** | https://app.sendgrid.com/settings/api_keys |
| **Sender Auth** | https://app.sendgrid.com/settings/sender_auth/senders |
| **Dokümantasyon** | https://docs.sendgrid.com/ |

---

## ⚠️ Güvenlik Notları

1. ✅ API key'i **asla** git'e commit etmeyin
2. ✅ API key'i **asla** public yerlerde paylaşmayın
3. ✅ Eğer key sızdırıldıysa hemen yeni key oluşturun
4. ✅ Production'da **"Restricted Access"** kullanın (sadece Mail Send)

---

## 🆚 Resend vs SendGrid

| Özellik | Resend | SendGrid |
|---------|--------|----------|
| **Free Tier** | 100 email/gün, 3,000/ay | 100/gün, 40,000/ay |
| **Kolaylık** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Kurulum** | Çok kolay | Orta |
| **Domain Verification** | Gerekli | Gerekli |
| **API Key Format** | `re_xxx` | `SG.xxx` |

**Öneri:** Resend daha kolay ama SendGrid daha fazla ücretsiz email veriyor.

---

## ✅ Kontrol Listesi

- [ ] SendGrid hesabı oluşturuldu
- [ ] API key oluşturuldu ve kopyalandı
- [ ] Sender email doğrulandı
- [ ] API key Vercel'e eklendi
- [ ] FROM_EMAIL Vercel'e eklendi
- [ ] Deployment redeploy edildi

---

**Hazırlayan:** AI Assistant  
**Tarih:** 2025-01-09  
**Durum:** ✅ Rehber Hazır

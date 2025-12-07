# 🔐 SendGrid Vercel Kurulum Rehberi

## ✅ SendGrid API Key Hazır

**API Key:** `SG.your_api_key_here` (Vercel Environment Variables'da zaten mevcut)

## 📝 Vercel'de Eklenecek Environment Variables

### 1. SendGrid API Key Ekle

1. [Vercel Dashboard](https://vercel.com/dashboard) → estatebali projesine tıkla
2. **Settings** → **Environment Variables**
3. **Add New** butonuna tıkla:
   - **Key:** `SENDGRID_API_KEY`
   - **Value:** `SG.your_api_key_here` (SendGrid'den aldığınız API key'i buraya yapıştırın)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development (hepsini seç)
4. **Save** butonuna tıkla

### 2. FROM_EMAIL Ekle

1. **Add New** butonuna tekrar tıkla:
   - **Key:** `FROM_EMAIL`
   - **Value:** SendGrid'de doğruladığınız email adresi
     - Örnek: `noreply@yourdomain.com`
     - VEYA test için: `yourname@gmail.com` (doğrulanmış olmalı)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development (hepsini seç)
2. **Save** butonuna tıkla

## ⚠️ ÖNEMLİ: Sender Email Doğrulama

SendGrid API çalışması için FROM_EMAIL'in doğrulanmış olması gerekiyor:

### Eğer henüz doğrulamadıysanız:

1. [SendGrid Dashboard](https://app.sendgrid.com/) → Login
2. **Settings** → **Sender Authentication** → **Senders**
3. **"Create New Sender"** butonuna tıkla
4. Email adresinizi girin (örn: `yourname@gmail.com`)
5. SendGrid'in gönderdiği doğrulama email'ini onaylayın
6. Durum **"Verified"** olana kadar bekleyin
7. Bu email adresini FROM_EMAIL olarak kullanın

## 🔄 Deployment'ı Başlat

Email servisi eklendikten sonra:

1. **Deployments** tab'ına git
2. Son deployment'ın yanındaki **"..."** menüsünden **"Redeploy"** seç
   - VEYA yeni bir commit push'la (otomatik deploy edilir)

## ✅ Kontrol Listesi

- [ ] SENDGRID_API_KEY Vercel'e eklendi
- [ ] FROM_EMAIL Vercel'e eklendi (doğrulanmış email)
- [ ] Deployment redeploy edildi
- [ ] Build başarılı oldu

## 🎯 Hızlı Test İçin

FROM_EMAIL olarak kendi email adresinizi kullanabilirsiniz:
- `FROM_EMAIL=yourname@gmail.com` (SendGrid'de doğrulanmış olmalı)

Bu test için yeterli olacaktır!

## 📊 Beklenen Sonuç

Deployment başarılı olduktan sonra:
- ✅ Email servisi hatası çözülmüş olmalı
- ✅ Build başarılı olmalı
- ✅ Password reset ve transactional email'ler çalışmalı

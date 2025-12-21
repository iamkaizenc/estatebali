# 🐛 Sentry Kurulum Rehberi (Web + React Native)

Bu rehber, EstateBali projesi için Sentry hata izleme sistemini hem web (Next.js) hem de iOS (React Native) uygulamalarına kurmak için adım adım talimatlar içerir.

---

## 📋 İÇİNDEKİLER

1. [Sentry Hesabı Oluşturma](#1-sentry-hesabı-oluşturma)
2. [Web Projesi için DSN Alma](#2-web-projesi-için-dsn-alma)
3. [React Native Projesi için DSN Alma](#3-react-native-projesi-için-dsn-alma)
4. [Vercel'e Environment Variable Ekleme](#4-vercele-environment-variable-ekleme)
5. [EAS Build'e Environment Variable Ekleme](#5-eas-builde-environment-variable-ekleme)
6. [Local Development (.env.local)](#6-local-development-envlocal)
7. [Test ve Doğrulama](#7-test-ve-doğrulama)
8. [Sorun Giderme](#8-sorun-giderme)

---

## 1. Sentry Hesabı Oluşturma

### Adım 1.1: Sentry'ye Kaydol

1. **Sentry web sitesine git:** https://sentry.io
2. **"Sign Up" butonuna tıkla**
3. **Email ve şifre ile kaydol** (veya GitHub/Google ile giriş yap)
4. **Email doğrulamasını tamamla**

### Adım 1.2: Organization Oluştur

1. İlk girişte Sentry sizden bir **Organization** oluşturmanızı ister
2. **Organization Name:** `EstateBali` (veya istediğiniz isim)
3. **Plan seç:** Free plan ile başlayabilirsiniz (ayda 5,000 event limit)
4. **"Create Organization" butonuna tıkla**

---

## 2. Web Projesi için DSN Alma

### Adım 2.1: Yeni Proje Oluştur (Web)

1. Sentry Dashboard'da **"Create Project"** butonuna tıkla
2. **Platform seç:** `Next.js` (veya `JavaScript` → `Next.js`)
3. **Project Name:** `estatebali-web` (veya istediğiniz isim)
4. **Team seç:** Varsayılan team'i kullanabilirsiniz
5. **"Create Project" butonuna tıkla**

### Adım 2.2: DSN'i Kopyala

1. Proje oluşturulduktan sonra Sentry size **"Configure SDK"** sayfasını gösterir
2. Bu sayfada **DSN (Data Source Name)** görünür
3. **DSN formatı şöyle görünür:**
   ```
   https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
   ```
4. **DSN'i kopyala** (sağ taraftaki kopyala butonuna tıkla veya manuel kopyala)
5. **Bu DSN'i bir yere kaydet** (notepad, notes app, vs.)

### Adım 2.3: DSN Formatını Kontrol Et

DSN şu formatta olmalı:
```
https://[PUBLIC_KEY]@[ORG_ID].ingest.sentry.io/[PROJECT_ID]
```

**Örnek:**
```
https://abc123def456ghi789jkl012mno345pqr678stu901vwx234yz@o1234567.ingest.sentry.io/1234567
```

---

## 3. React Native Projesi için DSN Alma

### Adım 3.1: Yeni Proje Oluştur (iOS)

1. Sentry Dashboard'da tekrar **"Create Project"** butonuna tıkla
2. **Platform seç:** `React Native` (veya `React Native` → `Expo`)
3. **Project Name:** `estatebali-ios` (veya istediğiniz isim)
4. **Team seç:** Aynı team'i kullanabilirsiniz
5. **"Create Project" butonuna tıkla**

### Adım 3.2: DSN'i Kopyala

1. Yine **"Configure SDK"** sayfasında DSN görünür
2. **Bu DSN'i de kopyala ve kaydet**
3. **Not:** Web ve iOS için farklı DSN'ler kullanılır (her proje kendi DSN'ine sahiptir)

---

## 4. Vercel'e Environment Variable Ekleme

### Adım 4.1: Vercel Dashboard'a Git

1. **Vercel Dashboard:** https://vercel.com/dashboard
2. **EstateBali projesini seç**
3. **Settings** sekmesine git
4. **Environment Variables** sekmesine tıkla

### Adım 4.2: NEXT_PUBLIC_SENTRY_DSN Ekle

1. **"Add New"** butonuna tıkla
2. **Key:** `NEXT_PUBLIC_SENTRY_DSN`
3. **Value:** Web projesi için kopyaladığın DSN'i yapıştır
   ```
   https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
   ```
4. **Environment:** 
   - ✅ **Production** (mutlaka işaretle)
   - ✅ **Preview** (opsiyonel, test için)
   - ❌ **Development** (genelde local'de test edilir)
5. **"Save" butonuna tıkla**

### Adım 4.3: Deploy'u Tetikle

1. Environment variable eklendikten sonra **yeni bir deploy yap**
2. Vercel Dashboard'da **"Deployments"** sekmesine git
3. **"Redeploy"** butonuna tıkla (son deployment'ı yeniden deploy et)
4. Veya GitHub'a bir commit push'la (otomatik deploy olur)

### Adım 4.4: Deploy Sonrası Kontrol

1. Deploy tamamlandıktan sonra **production URL'ini aç**
2. **Bir hata oluştur** (örneğin, olmayan bir sayfaya git)
3. **Sentry Dashboard'a git** → Projeler → `estatebali-web`
4. **Issues** sekmesinde hatayı görmelisin

---

## 5. EAS Build'e Environment Variable Ekleme

### Adım 5.1: EAS CLI Kurulumu (Eğer yoksa)

```bash
npm install -g eas-cli
```

### Adım 5.2: EAS Login

```bash
eas login
```

### Adım 5.3: EAS Build Configure

1. iOS projesinin root dizininde:
   ```bash
   cd /path/to/ios-app
   eas build:configure
   ```

2. Bu komut `eas.json` dosyası oluşturur (veya günceller)

### Adım 5.4: Environment Variable Ekle (eas.json)

`eas.json` dosyasını aç ve şunu ekle:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567"
      }
    },
    "preview": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567"
      }
    }
  }
}
```

**Not:** `EXPO_PUBLIC_SENTRY_DSN` değerini React Native projesi için aldığın DSN ile değiştir.

### Adım 5.5: app.config.js veya app.json'a Ekle (Alternatif)

Eğer `eas.json` kullanmıyorsan, `app.config.js` veya `app.json` dosyasına ekle:

**app.config.js:**
```javascript
export default {
  expo: {
    // ... diğer ayarlar
    extra: {
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'https://xxx@sentry.io/xxx',
    },
  },
};
```

**app.json:**
```json
{
  "expo": {
    "extra": {
      "sentryDsn": "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567"
    }
  }
}
```

### Adım 5.6: .env Dosyasına Ekle (Local Development)

iOS projesinin root dizininde `.env` dosyası oluştur (veya varsa güncelle):

```bash
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
```

**Not:** `.env` dosyasını `.gitignore`'a ekle (güvenlik için).

### Adım 5.7: EAS Build Yap

```bash
eas build --platform ios --profile production
```

Build tamamlandıktan sonra Sentry'ye hatalar gönderilmeye başlar.

---

## 6. Local Development (.env.local)

### Web Projesi için (.env.local)

Web projesinin root dizininde `.env.local` dosyası oluştur (veya güncelle):

```bash
# Sentry DSN (Web)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567

# Development'ta Sentry'yi devre dışı bırakmak için (opsiyonel)
SENTRY_DEBUG=false
```

**Not:** Development'ta Sentry genelde devre dışıdır (kodda `beforeSend` ile kontrol ediliyor). Test etmek için `SENTRY_DEBUG=true` yapabilirsin.

### iOS Projesi için (.env)

iOS projesinin root dizininde `.env` dosyası:

```bash
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
```

---

## 7. Test ve Doğrulama

### Web Projesi Testi

1. **Local'de test:**
   ```bash
   npm run dev
   ```
   Tarayıcıda bir hata oluştur (örneğin, olmayan bir sayfaya git)

2. **Sentry Dashboard kontrol:**
   - Sentry Dashboard → `estatebali-web` → Issues
   - Hatayı görmelisin

3. **Production'da test:**
   - Production URL'ini aç
   - Bir hata oluştur
   - Sentry Dashboard'da kontrol et

### iOS Projesi Testi

1. **Local'de test:**
   ```bash
   npm start
   # veya
   expo start
   ```
   Uygulamada bir hata oluştur (örneğin, undefined bir değişkene eriş)

2. **Sentry Dashboard kontrol:**
   - Sentry Dashboard → `estatebali-ios` → Issues
   - Hatayı görmelisin

3. **Build'de test:**
   - EAS build yap
   - TestFlight'a yükle
   - Uygulamada hata oluştur
   - Sentry Dashboard'da kontrol et

---

## 8. Sorun Giderme

### Sorun 1: "Sentry DSN is not configured"

**Çözüm:**
- Environment variable'ın doğru adla eklendiğinden emin ol (`NEXT_PUBLIC_SENTRY_DSN` veya `EXPO_PUBLIC_SENTRY_DSN`)
- DSN'in doğru formatta olduğundan emin ol (https:// ile başlamalı)
- Deploy/build sonrası environment variable'ın yüklendiğinden emin ol

### Sorun 2: "Events are not appearing in Sentry"

**Çözüm:**
- Development'ta Sentry devre dışı olabilir (`beforeSend` kontrolü)
- `SENTRY_DEBUG=true` yaparak test et
- Production'da test et (development'ta gönderilmiyor olabilir)
- Sentry Dashboard'da proje ayarlarını kontrol et

### Sorun 3: "Invalid DSN format"

**Çözüm:**
- DSN'i tekrar kopyala (boşluk veya yanlış karakter olmamalı)
- DSN'in tamamını kopyaladığından emin ol
- Environment variable'da tırnak işareti kullanma (sadece DSN'i yapıştır)

### Sorun 4: "CORS error" (Web)

**Çözüm:**
- Sentry DSN'in doğru domain'den geldiğinden emin ol
- Sentry Dashboard → Settings → Client Keys (DSN) kontrol et
- Browser console'da hata mesajını kontrol et

### Sorun 5: "Sentry not initialized" (iOS)

**Çözüm:**
- `app.config.js` veya `eas.json`'da environment variable doğru mu?
- Expo'da `expo-constants` ile environment variable'a erişiyor musun?
- Build sonrası environment variable'ın yüklendiğinden emin ol

---

## 📝 ÖZET CHECKLIST

### Web Projesi (Vercel)
- [ ] Sentry hesabı oluşturuldu
- [ ] Web projesi için DSN alındı
- [ ] Vercel'e `NEXT_PUBLIC_SENTRY_DSN` eklendi
- [ ] Production environment seçildi
- [ ] Deploy yapıldı
- [ ] Test edildi (Sentry Dashboard'da görünüyor)

### iOS Projesi (EAS)
- [ ] React Native projesi için DSN alındı
- [ ] `eas.json` veya `app.config.js`'e `EXPO_PUBLIC_SENTRY_DSN` eklendi
- [ ] `.env` dosyasına eklendi (local development için)
- [ ] EAS build yapıldı
- [ ] Test edildi (Sentry Dashboard'da görünüyor)

### Local Development
- [ ] `.env.local` dosyasına web DSN eklendi
- [ ] iOS `.env` dosyasına iOS DSN eklendi
- [ ] Local'de test edildi

---

## 🔗 FAYDALI LİNKLER

- **Sentry Dashboard:** https://sentry.io/organizations/[your-org]/projects/
- **Sentry Next.js Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Sentry React Native Docs:** https://docs.sentry.io/platforms/react-native/
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/

---

## ✅ BAŞARI KRİTERLERİ

Sentry başarıyla kurulmuş sayılır eğer:

- ✅ Web projesinde hatalar Sentry Dashboard'da görünüyor
- ✅ iOS projesinde hatalar Sentry Dashboard'da görünüyor
- ✅ Environment variable'lar doğru yapılandırılmış
- ✅ Production'da çalışıyor
- ✅ Local development'ta test edilebiliyor

---

## 🎉 TAMAMLANDI!

Artık EstateBali projenizde hem web hem de iOS için Sentry hata izleme sistemi aktif! Herhangi bir hata oluştuğunda Sentry Dashboard'da görebileceksiniz.

**Sonraki Adımlar:**
- Sentry Dashboard'da alert kuralları oluştur (email/Slack bildirimleri)
- Release tracking'i aktifleştir (hangi versiyonda hata oluştuğunu görmek için)
- Performance monitoring'i aktifleştir (yavaş sayfaları tespit etmek için)

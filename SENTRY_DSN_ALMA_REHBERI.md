# 🔑 Sentry DSN Alma Rehberi (Görsel Adımlar)

Bu rehber, Sentry'de proje oluşturup DSN'i nasıl alacağını adım adım gösterir.

---

## 📋 ÖNEMLİ: API Key vs DSN Farkı

- **API Key (sentry_xxx):** Sentry API'lerini çağırmak için kullanılır (backend işlemleri)
- **DSN (https://xxx@sentry.io/xxx):** Uygulamanızda hataları Sentry'ye göndermek için kullanılır (frontend/backend)

**Senin durumunda:** API key'in var, şimdi DSN alman gerekiyor.

---

## 🚀 ADIM ADIM: DSN ALMA

### ADIM 1: Sentry Dashboard'a Giriş Yap

1. **Tarayıcıda aç:** https://sentry.io
2. **"Sign In" butonuna tıkla**
3. **Email ve şifre ile giriş yap** (veya GitHub/Google ile)

### ADIM 2: Organization Kontrolü

1. Giriş yaptıktan sonra **üst menüde organization adını görürsün**
2. Eğer organization yoksa, Sentry otomatik olarak oluşturur
3. **Organization adı:** Genelde email'inizin domain'i veya manuel seçtiğiniz isim

### ADIM 3: Yeni Proje Oluştur (Web için)

1. **Sol menüden "Projects" sekmesine tıkla**
   - Veya direkt: https://sentry.io/organizations/[org-name]/projects/
   
2. **Sağ üstte "Create Project" butonuna tıkla**
   - Büyük yeşil/mavi buton

3. **Platform seçimi:**
   - Arama kutusuna `Next.js` yaz
   - **"Next.js"** seçeneğine tıkla
   - Veya **"JavaScript"** → **"Next.js"** seç

4. **Proje bilgileri:**
   - **Project Name:** `estatebali-web` (veya istediğin isim)
   - **Team:** Varsayılan team'i seç (genelde tek team olur)
   - **Alert Frequency:** "Only send me an email when a new issue is created" (önerilen)

5. **"Create Project" butonuna tıkla**

### ADIM 4: DSN'i Kopyala (Web)

1. Proje oluşturulduktan sonra **"Configure SDK"** sayfası açılır
2. Bu sayfada **DSN görünür:**
   ```
   https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
   ```
3. **DSN'in yanında küçük bir kopyala butonu var** (kopya ikonu)
4. **Kopyala butonuna tıkla** veya DSN'i manuel seçip kopyala (Cmd+C / Ctrl+C)

5. **DSN'i bir yere kaydet:**
   - Notepad
   - Notes app
   - `.env.local` dosyasına yapıştır (sonra kullanacağız)

### ADIM 5: İkinci Proje Oluştur (iOS için)

1. **Tekrar "Create Project" butonuna tıkla**

2. **Platform seçimi:**
   - Arama kutusuna `React Native` yaz
   - **"React Native"** seçeneğine tıkla
   - Veya **"React Native"** → **"Expo"** seç (Expo kullanıyorsan)

3. **Proje bilgileri:**
   - **Project Name:** `estatebali-ios` (veya istediğin isim)
   - **Team:** Aynı team'i seç
   - **Alert Frequency:** Aynı ayarı seç

4. **"Create Project" butonuna tıkla**

### ADIM 6: İkinci DSN'i Kopyala (iOS)

1. Yine **"Configure SDK"** sayfasında DSN görünür
2. **Bu DSN'i de kopyala** (web'den farklı olacak)
3. **Kaydet**

---

## 📝 DSN FORMATI KONTROLÜ

DSN şu formatta olmalı:

```
https://[PUBLIC_KEY]@[ORG_ID].ingest.sentry.io/[PROJECT_ID]
```

**Örnek:**
```
https://abc123def456ghi789jkl012mno345pqr678stu901vwx234yz@o1234567.ingest.sentry.io/1234567
```

**Kontrol listesi:**
- ✅ `https://` ile başlamalı
- ✅ `@` işareti içermeli
- ✅ `sentry.io` içermeli
- ✅ Uzun bir string olmalı (50+ karakter)

---

## 🔍 DSN'i SONRADAN BULMA

Eğer DSN'i kaybettiysen veya sonradan bulmak istersen:

### Yöntem 1: Project Settings'ten

1. **Sentry Dashboard** → **Projects** → Projeni seç (`estatebali-web` veya `estatebali-ios`)
2. **Sol menüden "Settings"** → **"Client Keys (DSN)"** sekmesine tıkla
3. **DSN burada görünür**
4. **Kopyala butonuna tıkla**

### Yöntem 2: Project Overview'dan

1. **Project sayfasına git**
2. **Sağ üstte "Settings"** (dişli ikonu) → **"Client Keys (DSN)"**
3. **DSN'i kopyala**

---

## ✅ ŞİMDİ NE YAPMALISIN?

### 1. Web DSN'i Vercel'e Ekle

1. **Vercel Dashboard:** https://vercel.com/dashboard
2. **EstateBali projesini seç**
3. **Settings** → **Environment Variables**
4. **"Add New"** butonuna tıkla
5. **Key:** `NEXT_PUBLIC_SENTRY_DSN`
6. **Value:** Web DSN'ini yapıştır
7. **Environment:** ✅ Production, ✅ Preview
8. **Save** → **Redeploy**

### 2. iOS DSN'i EAS Build'e Ekle

1. **iOS projesinde `eas.json` dosyasını aç** (veya oluştur)
2. **Şunu ekle:**
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_SENTRY_DSN": "https://xxx@sentry.io/xxx"
         }
       }
     }
   }
   ```
3. **`.env` dosyasına da ekle** (local development için)

### 3. Local Development için

**Web projesi `.env.local`:**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**iOS projesi `.env`:**
```bash
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 🎯 HIZLI KONTROL LİSTESİ

- [ ] Sentry Dashboard'a giriş yaptım
- [ ] Web projesi oluşturdum (`estatebali-web`)
- [ ] Web DSN'ini kopyaladım
- [ ] iOS projesi oluşturdum (`estatebali-ios`)
- [ ] iOS DSN'ini kopyaladım
- [ ] Vercel'e web DSN'ini ekledim
- [ ] EAS Build'e iOS DSN'ini ekledim
- [ ] Local `.env` dosyalarına ekledim

---

## 🆘 SORUN GİDERME

### Sorun 1: "Create Project" butonu görünmüyor

**Çözüm:**
- Organization'da admin yetkisi var mı kontrol et
- Farklı bir browser/incognito modu dene
- Sayfayı yenile (F5)

### Sorun 2: DSN kopyalanmıyor

**Çözüm:**
- DSN'i manuel seç (mouse ile) → Cmd+C / Ctrl+C
- Veya Settings → Client Keys (DSN) sayfasından kopyala

### Sorun 3: DSN formatı yanlış görünüyor

**Çözüm:**
- DSN'in tamamını kopyaladığından emin ol
- Boşluk veya ekstra karakter olmamalı
- `https://` ile başlamalı

### Sorun 4: İki proje oluşturmak istemiyorum

**Çözüm:**
- Tek bir proje kullanabilirsin (hem web hem iOS için)
- Ama önerilen: Ayrı projeler (daha iyi organizasyon)

---

## 📸 GÖRSEL REFERANSLAR

### 1. Create Project Butonu
```
Sentry Dashboard
├── Sol Menü: Projects
└── Sağ Üst: [Create Project] ← Buraya tıkla
```

### 2. Platform Seçimi
```
Platform Seçimi
├── Arama: "Next.js" veya "React Native"
└── Platform kartına tıkla
```

### 3. DSN Konumu
```
Configure SDK Sayfası
├── "Configure your SDK" başlığı
├── Kod örneği
└── DSN: https://xxx@sentry.io/xxx ← Burayı kopyala
```

### 4. Settings'ten DSN Bulma
```
Project Sayfası
├── Settings (dişli ikonu)
├── Client Keys (DSN)
└── DSN burada görünür
```

---

## 🔗 FAYDALI LİNKLER

- **Sentry Dashboard:** https://sentry.io/organizations/[org-name]/projects/
- **Sentry Docs:** https://docs.sentry.io/
- **Next.js Integration:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **React Native Integration:** https://docs.sentry.io/platforms/react-native/

---

## ✅ BAŞARI KRİTERLERİ

DSN'i başarıyla aldın sayılır eğer:

- ✅ İki DSN'in var (web ve iOS)
- ✅ Her DSN `https://` ile başlıyor
- ✅ Her DSN `@` ve `sentry.io` içeriyor
- ✅ DSN'leri kaydettin
- ✅ Vercel ve EAS'e ekledin

---

## 🎉 TAMAMLANDI!

Artık DSN'lerin hazır! Şimdi bunları environment variable'lara ekleyip test edebilirsin.

**Sonraki Adım:** `SENTRY_KURULUM_REHBERI.md` dosyasındaki "Vercel'e Environment Variable Ekleme" ve "EAS Build'e Environment Variable Ekleme" bölümlerini takip et.

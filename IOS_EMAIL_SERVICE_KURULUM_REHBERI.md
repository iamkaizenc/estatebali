# 📱 iOS Email Servisleri Kurulum Rehberi (Adım Adım)

## 🎯 Bu Rehber Ne İçin?

iOS uygulamanızda şifre sıfırlama email'lerini göndermek için backend API'lerinizi kullanmak istiyorsunuz. Bu rehber, `IOS_EMAIL_SERVICE_PROMPT.md` dosyasındaki prompt'u nasıl kullanacağınızı adım adım açıklar.

---

## 📋 ÖN HAZIRLIK

### 1. iOS Projenizi Açın
- iOS uygulamanızın bulunduğu klasörü Cursor'da açın
- Veya yeni bir Cursor penceresi açıp iOS projesine gidin

### 2. Proje Yapısını Kontrol Edin
iOS projenizde şu klasörler/dosyalar olmalı:
```
ios-app/
├── screens/          (veya screens/, components/, views/)
├── services/         (veya api/, lib/, utils/)
├── app.config.js     (veya eas.json, .env)
└── App.tsx           (veya App.js, index.js)
```

Eğer bu klasörler yoksa, Cursor'a prompt verirken oluşturmasını söyleyin.

---

## 🚀 ADIM ADIM UYGULAMA

### ADIM 1: Prompt'u Hazırlayın

1. **`IOS_EMAIL_SERVICE_PROMPT.md` dosyasını açın** (bu dosya web projenizde)
2. **"CURSOR MASTER PROMPT" bölümünü bulun** (satır 6-332 arası)
3. **Tüm prompt'u kopyalayın** (```text ile başlayıp ``` ile biten kısım)

### ADIM 2: iOS Projesinde Cursor'a Prompt Verin

#### Yöntem A: Chat'e Yapıştırma (Önerilen)
1. iOS projesinde Cursor Chat'i açın
2. Kopyaladığınız prompt'u yapıştırın
3. Enter'a basın ve Cursor'ın çalışmasını bekleyin

#### Yöntem B: Command Kullanma
1. Cursor'da `Cmd+K` (Mac) veya `Ctrl+K` (Windows) basın
2. Prompt'u yapıştırın
3. Enter'a basın

### ADIM 3: Cursor'ın Yapacağı İşlemler

Cursor şunları yapacak:

#### ✅ STEP 0: Kontrol
- Backend API endpoint'lerinin varlığını kontrol eder
- iOS proje yapısını inceler
- Mevcut dosyaları bulur

#### ✅ STEP 1: Email Service Client Oluşturur
**Dosya:** `services/emailService.ts` (veya benzeri)

Bu dosya:
- Backend API'lerini çağıran fonksiyonlar içerir
- `sendPasswordResetEmail()` - Şifre sıfırlama email'i gönderir
- `resetPassword()` - Token ile şifreyi sıfırlar
- `testEmail()` - Test email gönderir (opsiyonel)

**Örnek kod:**
```typescript
// services/emailService.ts
const API_BASE_URL = 'https://estatebali.app/api';

export const emailService = {
  async sendPasswordResetEmail({ email }) {
    // Backend API'yi çağırır
  },
  async resetPassword({ token, password }) {
    // Backend API'yi çağırır
  }
};
```

#### ✅ STEP 2: Forgot Password Ekranını Günceller
**Dosya:** `screens/ForgotPasswordScreen.tsx` (veya benzeri)

Yapılacaklar:
- `emailService`'i import eder
- Eski mock/placeholder kodları kaldırır
- `emailService.sendPasswordResetEmail()` kullanır
- Loading state ekler
- Success/error mesajları gösterir

**Örnek:**
```typescript
import { emailService } from '@/services/emailService';

const handleForgotPassword = async (email) => {
  setLoading(true);
  const result = await emailService.sendPasswordResetEmail({ email });
  if (result.success) {
    // Başarılı mesaj göster
  } else {
    // Hata mesajı göster
  }
  setLoading(false);
};
```

#### ✅ STEP 3: Reset Password Ekranını Günceller
**Dosya:** `screens/ResetPasswordScreen.tsx` (veya benzeri)

Yapılacaklar:
- `emailService`'i import eder
- `emailService.resetPassword()` kullanır
- Token'ı deep link'ten veya navigation params'tan alır
- Loading state ekler
- Başarılı olunca login ekranına yönlendirir

#### ✅ STEP 4: Environment Variables Ekler
**Dosya:** `app.config.js` veya `.env`

Ekleyeceği:
```javascript
{
  "expo": {
    "extra": {
      "apiUrl": "https://estatebali.app/api"
    }
  }
}
```

Veya `.env` dosyasına:
```
EXPO_PUBLIC_API_URL=https://estatebali.app/api
```

#### ✅ STEP 5: Deep Link Handling Ekler (Opsiyonel)
**Dosya:** `App.tsx` veya navigation setup

Email'deki link tıklandığında iOS app'i açmak için:
- `estatebali://reset-password?token=xxx` formatını handle eder
- Token'ı extract eder
- Reset password ekranına yönlendirir

#### ✅ STEP 6-7: Error Handling ve Testing
- Network error handling
- Loading states
- User-friendly error messages
- Test senaryoları

---

## 🔍 CURSOR'DAN SONRA KONTROL EDİLECEKLER

### 1. Dosyalar Oluşturuldu mu?
```bash
# Terminal'de kontrol edin:
ls services/emailService.ts
ls screens/ForgotPasswordScreen.tsx
ls screens/ResetPasswordScreen.tsx
```

### 2. Environment Variable Eklendi mi?
```bash
# app.config.js veya .env dosyasını kontrol edin:
cat app.config.js | grep apiUrl
# veya
cat .env | grep EXPO_PUBLIC_API_URL
```

### 3. Import'lar Doğru mu?
- `emailService.ts` dosyasında import path'ler doğru mu?
- Screen'lerde `emailService` import edilmiş mi?

### 4. API URL Doğru mu?
- `https://estatebali.app/api` kullanılıyor mu?
- Development için localhost kullanılıyorsa, production'da değiştirilmeli

---

## 🧪 TEST ETME

### Test Senaryoları:

1. **Forgot Password Testi:**
   ```
   - Forgot password ekranını aç
   - Geçerli bir email gir
   - "Send Reset Link" butonuna bas
   - Loading gösterilmeli
   - Success mesajı görünmeli
   - Email'in geldiğini kontrol et
   ```

2. **Invalid Email Testi:**
   ```
   - Geçersiz email gir (örn: "test")
   - Hata mesajı gösterilmeli
   ```

3. **Network Error Testi:**
   ```
   - Internet'i kapat
   - Email göndermeyi dene
   - Network error mesajı gösterilmeli
   ```

4. **Reset Password Testi:**
   ```
   - Email'deki reset link'ine tıkla
   - iOS app açılmalı (deep link çalışıyorsa)
   - Veya web'den token'ı kopyala
   - Reset password ekranına token'ı yapıştır
   - Yeni şifre gir
   - Başarılı mesaj gösterilmeli
   - Login ekranına yönlendirilmeli
   ```

---

## ⚠️ SIK KARŞILAŞILAN SORUNLAR

### Sorun 1: "Cannot find module '@/services/emailService'"
**Çözüm:**
- `tsconfig.json` veya `babel.config.js`'de path alias kontrol edin
- `@/` yerine relative path kullanın: `../../services/emailService`

### Sorun 2: "API_BASE_URL is undefined"
**Çözüm:**
- `app.config.js` veya `.env` dosyasında `EXPO_PUBLIC_API_URL` tanımlı mı kontrol edin
- Expo'da environment variable'ları kullanmak için `expo-constants` gerekebilir

### Sorun 3: "Network request failed"
**Çözüm:**
- Backend API'nin çalıştığından emin olun
- CORS ayarlarını kontrol edin
- API URL'in doğru olduğundan emin olun

### Sorun 4: "Deep link çalışmıyor"
**Çözüm:**
- `app.config.js`'de scheme tanımlı mı kontrol edin:
  ```javascript
  {
    "expo": {
      "scheme": "estatebali"
    }
  }
  ```
- iOS'ta URL scheme'i register edilmiş mi kontrol edin

---

## 📝 MANUEL YAPILMASI GEREKENLER (Cursor Yapmazsa)

### 1. Environment Variable Ekleme

**app.config.js** dosyasına ekleyin:
```javascript
export default {
  expo: {
    // ... diğer ayarlar
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://estatebali.app/api',
    },
  },
};
```

**veya .env** dosyasına:
```
EXPO_PUBLIC_API_URL=https://estatebali.app/api
```

### 2. Path Alias Kontrolü

**tsconfig.json** veya **babel.config.js**'de:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. Deep Link Scheme Ekleme

**app.config.js**'de:
```javascript
{
  "expo": {
    "scheme": "estatebali",
    "ios": {
      "bundleIdentifier": "com.estatebali.app"
    }
  }
}
```

---

## ✅ BAŞARI KRİTERLERİ

Prompt başarılı olmuş sayılır eğer:

- ✅ `services/emailService.ts` dosyası oluşturuldu
- ✅ Forgot password ekranı `emailService` kullanıyor
- ✅ Reset password ekranı `emailService` kullanıyor
- ✅ Environment variable eklendi
- ✅ Loading states çalışıyor
- ✅ Error handling çalışıyor
- ✅ Test senaryoları geçiyor

---

## 🆘 YARDIM GEREKİRSE

Eğer Cursor bir adımı atladıysa veya hata veriyorsa:

1. **Hata mesajını kopyalayın**
2. **Cursor Chat'e şunu yazın:**
   ```
   [Hata mesajını buraya yapıştır]
   
   Bu hatayı düzelt ve eksik adımları tamamla.
   ```

3. **Veya spesifik bir adımı tekrar isteyin:**
   ```
   STEP 1'i tekrar yap: Email service client oluştur
   ```

---

## 📚 EK KAYNAKLAR

- Backend API dokümantasyonu: `/api/auth/forgot-password` ve `/api/auth/reset-password`
- Expo environment variables: https://docs.expo.dev/guides/environment-variables/
- React Native deep linking: https://reactnative.dev/docs/linking

---

## 🎉 SONUÇ

Bu prompt'u kullandıktan sonra iOS uygulamanız:
- ✅ Backend API'lerini çağırabilir
- ✅ Şifre sıfırlama email'i gönderebilir
- ✅ Token ile şifre sıfırlayabilir
- ✅ Deep link'leri handle edebilir
- ✅ Güvenli bir şekilde email servislerini kullanabilir

**Önemli:** iOS app asla Resend/SendGrid API key'lerini içermemeli. Tüm email gönderimi backend üzerinden yapılmalı!

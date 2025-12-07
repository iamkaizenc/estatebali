# 🔍 Infinite Loading Sorunu - Debug Rehberi

## Olası Sebepler

### 1. API İstekleri Başarısız Oluyor
- `/api/properties` endpoint'i çalışmıyor olabilir
- Supabase bağlantısı kurulamıyor olabilir
- CORS hatası olabilir

### 2. useProperties Hook'u Takılıyor
- API'den cevap gelmiyorsa loading state sürekli `true` kalır
- Network timeout olabilir
- Error handling eksik olabilir

### 3. Browser Console'da Hata Var
- JavaScript error olabilir
- API call fail oluyor olabilir
- Supabase client initialize olamıyor olabilir

## 🔧 Hızlı Kontrol Adımları

### Adım 1: Browser Console Kontrolü
1. Siteyi aç: https://estatebali.app
2. F12 → Console tab
3. Kırmızı hata var mı kontrol et
4. Network tab → Failed requests var mı?

### Adım 2: API Health Check
https://estatebali.app/api/health adresini aç

**Beklenen response:**
```json
{
  "status": "healthy",
  "services": {
    "database": true,
    "authentication": true,
    "email": true
  }
}
```

### Adım 3: Properties API Test
https://estatebali.app/api/properties adresini aç

**Beklenen:** Properties listesi JSON formatında

## 🐛 Muhtemel Sorunlar ve Çözümler

### Sorun 1: Supabase Bağlantı Hatası
**Kontrol:** `/api/health` endpoint'inde `database: false` görüyorsanız
**Çözüm:** Vercel'de Supabase environment variables kontrol edin

### Sorun 2: API Timeout
**Kontrol:** Network tab'da `/api/properties` request'i pending kalıyor
**Çözüm:** Supabase query optimize edilmeli veya timeout artırılmalı

### Sorun 3: CORS/Network Error
**Kontrol:** Console'da CORS veya network error
**Çözüm:** Vercel deployment ayarlarını kontrol edin

## 📝 Debug Komutları

Browser Console'da çalıştırın:

```javascript
// API Health Check
fetch('/api/health').then(r => r.json()).then(console.log)

// Properties API Test
fetch('/api/properties').then(r => r.json()).then(console.log)

// Supabase Connection Test
fetch('/api/test-env').then(r => r.json()).then(console.log)
```

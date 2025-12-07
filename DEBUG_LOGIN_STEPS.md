# 🔍 Login Debug Adımları

## Sorun: `/api/auth/login` Request'i Görünmüyor

Network tab'ında `/api/auth/login` POST request'i görünmüyorsa:

---

## ✅ ADIM ADIM DEBUG

### 1. Console'u Aç
- F12 → Console tab
- Console'u temizle (Clear button)

### 2. Network Tab'ı Hazırla
- F12 → Network tab
- "Preserve log" ✅ işaretle
- Filter'ı "Fetch/XHR" veya "All" yap

### 3. Login Denemesi Yap
1. Email: `admin@estatebali.app`
2. Password: `admin123`
3. **"Sign In" butonuna tıkla**

### 4. Console'u Kontrol Et
Şu mesajlar görünmeli:
```
[Login Page] Form submitted with email: admin@estatebali.app
[Login Page] Calling login function...
[Login] Attempting login for: admin@estatebali.app
[Login] Sending request to /api/auth/login
[Login] Response status: 200 OK
[Login] Response data: { success: true/false, ... }
[Login Page] Login result: { success: true/false, ... }
```

**Eğer bu mesajlar görünmüyorsa:**
- Form submit çalışmıyor
- JavaScript hatası var olabilir
- Console'da kırmızı error var mı kontrol et

### 5. Network Tab'ı Kontrol Et
`/api/auth/login` request'ini ara:
- Filter'a `login` yaz
- Veya "Fetch/XHR" filter'ını seç

**Request bulunursa:**
- Status: 200, 400, 401, 500?
- Response tab'ına tıkla
- Response body'yi oku

**Request bulunmazsa:**
- Form submit çalışmıyor
- JavaScript hatası var
- Console'daki error'ları kontrol et

---

## 🚨 YAYGIN SORUNLAR

### Sorun 1: "Sign In" butonuna basılıyor ama hiçbir şey olmuyor

**Kontrol:**
1. Console'da error var mı?
2. `[Login Page] Form submitted` mesajı görünüyor mu?

**Çözüm:**
- Sayfayı yenile (F5)
- Hard refresh yap (Ctrl+Shift+R / Cmd+Shift+R)

### Sorun 2: Request gidiyor ama 401/400 dönüyor

**Kontrol:**
- Network tab → `/api/auth/login` → Response tab
- Error mesajını oku

**Muhtemel Sebepler:**
- Kullanıcı database'de yok
- Password yanlış
- SQL script çalıştırılmadı

**Çözüm:**
- `FIX_LOGIN_IMMEDIATE.sql` script'ini Supabase'de çalıştır
- Test credentials ile dene

### Sorun 3: Request 500 dönüyor

**Kontrol:**
- Vercel logs'da `[Login]` mesajlarını kontrol et
- Server-side error var

**Çözüm:**
- Vercel logs'dan error mesajını kopyala
- Environment variables doğru mu kontrol et

---

## 📋 CHECKLIST

- [ ] Console açık mı?
- [ ] Network tab açık mı?
- [ ] "Preserve log" işaretli mi?
- [ ] Email ve password dolduruldu mu?
- [ ] "Sign In" butonuna tıklandı mı?
- [ ] Console'da `[Login]` mesajları görünüyor mu?
- [ ] Network tab'da `/api/auth/login` request'i var mı?
- [ ] Request status nedir? (200, 400, 401, 500?)
- [ ] Response body'de ne yazıyor?

---

## 🆘 HALA ÇALIŞMIYORSA

1. **Console'daki tüm mesajları** kopyala (özellikle kırmızı error'lar)
2. **Network tab'daki `/api/auth/login` request'ini** bul
   - Request tab → Headers'ı göster
   - Response tab → Body'yi kopyala
3. **Vercel logs'dan** `[Login]` ile başlayan mesajları kopyala

Bu bilgilerle daha spesifik yardım edebilirim.


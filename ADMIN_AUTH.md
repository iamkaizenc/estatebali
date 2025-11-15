# Admin Authentication Sistemi

## 🔐 Özellikler

### ✅ Tamamlanan Özellikler

1. **Admin Login Sayfası** (`/admin/login`)
   - Güvenli giriş formu
   - Email ve password doğrulama
   - Hata mesajları
   - Responsive tasarım

2. **Authentication Context**
   - Global authentication state
   - Login/Logout fonksiyonları
   - Token yönetimi (localStorage + cookies)
   - Session kontrolü

3. **Protected Admin Routes**
   - Admin paneli koruma altında
   - Otomatik login sayfasına yönlendirme
   - Loading state

4. **API Routes Koruması**
   - POST, PUT, DELETE işlemleri admin yetkisi gerektiriyor
   - Token doğrulama
   - Unauthorized erişim engelleniyor

5. **Logout Fonksiyonu**
   - Güvenli çıkış
   - Token ve cookie temizleme
   - Otomatik login sayfasına yönlendirme

## 🔑 Varsayılan Admin Bilgileri

**Email:** `admin@estatebali.app`
**Password:** `admin123`

⚠️ **ÖNEMLİ:** Production'da mutlaka değiştirin!

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── auth.ts              # Authentication utility functions
│   └── api-auth.ts          # API authentication middleware
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── components/
│   └── ProtectedAdminRoute.tsx  # Protected route wrapper
└── app/
    ├── admin/
    │   ├── login/
    │   │   └── page.tsx     # Admin login page
    │   └── page.tsx         # Admin dashboard (protected)
    └── api/
        └── properties/
            ├── route.ts     # GET, POST (protected)
            └── [id]/
                └── route.ts # GET, PUT (protected), DELETE (protected)
```

## 🚀 Kullanım

### Admin Girişi

1. `/admin/login` sayfasına git
2. Email ve password gir
3. "Sign In" butonuna tıkla
4. Başarılı girişte `/admin` sayfasına yönlendirilir

### Admin Paneli

1. `/admin` sayfası otomatik olarak korunuyor
2. Giriş yapılmadıysa `/admin/login` sayfasına yönlendirilir
3. Admin kullanıcı bilgisi header'da gösteriliyor
4. Logout butonu ile çıkış yapılabilir

### API Kullanımı

#### Public Endpoints (Giriş gerektirmez)
- `GET /api/properties` - Tüm property'leri listele

#### Protected Endpoints (Admin girişi gerekir)
- `POST /api/properties` - Yeni property oluştur
- `PUT /api/properties/[id]` - Property güncelle
- `DELETE /api/properties/[id]` - Property sil

**API Request Header:**
```javascript
{
  "Authorization": "Bearer <admin_token>",
  // veya
  "x-admin-token": "<admin_token>"
}
```

## 🔒 Güvenlik

### Mevcut Güvenlik Özellikleri

1. **Token-Based Authentication**
   - JWT-like token sistemi
   - 7 günlük expire süresi
   - localStorage ve cookie'de saklama

2. **Protected Routes**
   - Client-side route protection
   - Server-side API protection
   - Otomatik redirect

3. **Role-Based Access Control**
   - Admin rolü kontrolü
   - Yetki doğrulama

### Production İçin Öneriler

1. **Güçlü Password Hash**
   - bcrypt veya argon2 kullanın
   - Salt ekleyin

2. **Proper JWT Implementation**
   - `jsonwebtoken` library kullanın
   - Secret key environment variable'da saklayın

3. **Database Integration**
   - Admin kullanıcıları database'de saklayın
   - Password hash'leri database'de saklayın

4. **Rate Limiting**
   - Login attempt limiti
   - API rate limiting

5. **HTTPS**
   - Production'da mutlaka HTTPS kullanın
   - Secure cookies

6. **Session Management**
   - Refresh token mechanism
   - Token rotation
   - Session timeout

## 🛠️ Geliştirme

### Yeni Admin Kullanıcı Ekleme

Şu anda admin bilgileri `src/lib/auth.ts` dosyasında hardcoded. Production'da:

1. Database'e admin kullanıcıları ekleyin
2. Password hash'leyin
3. Login fonksiyonunu database'e bağlayın

### Environment Variables

Production'da şunları ekleyin:

```env
ADMIN_EMAIL=admin@estatebali.app
ADMIN_PASSWORD_HASH=<hashed_password>
JWT_SECRET=<secret_key>
JWT_EXPIRES_IN=7d
```

## 📝 Notlar

- Şu anda basit bir authentication sistemi kullanılıyor
- Production'da Supabase Auth veya NextAuth.js kullanılabilir
- Token'lar localStorage'da saklanıyor (production'da httpOnly cookies kullanın)
- Password şu anda plain text (production'da hash'lenmeli)

## 🔄 Gelecek Geliştirmeler

1. **Multi-User Support**
   - Birden fazla admin kullanıcı
   - Role-based permissions
   - User management paneli

2. **Advanced Security**
   - Two-factor authentication (2FA)
   - IP whitelist
   - Activity logging

3. **Session Management**
   - Refresh tokens
   - Session timeout
   - Active sessions listesi

4. **Password Management**
   - Password reset
   - Password change
   - Password strength requirements


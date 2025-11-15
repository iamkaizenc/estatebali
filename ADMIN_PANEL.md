# Admin Panel Kullanım Rehberi

## 📋 Admin Panel Özellikleri

Admin panel şu anda `/admin` sayfasında mevcut. Aşağıdaki özelliklere sahip:

### ✅ Mevcut Özellikler

1. **Property Listesi**
   - Tüm property'leri görüntüle
   - Property detaylarını görüntüle
   - Property'leri filtrele

2. **Property Yönetimi**
   - Property ekle
   - Property düzenle
   - Property sil
   - Featured/Unfeatured yap
   - Verify/Unverify yap

3. **İstatistikler**
   - Toplam property sayısı
   - Featured property sayısı
   - Satılık property sayısı
   - Kiralık property sayısı

### 🔐 Authentication (Gelecek)

Şu anda admin panel authentication olmadan açık. Production için authentication eklenmeli:

**Önerilen Çözümler:**
1. **NextAuth.js** - Kolay kurulum
2. **Supabase Auth** - Database ile entegre
3. **Custom Auth** - JWT token ile

## 🚀 Kullanım

### Admin Paneline Erişim

1. Tarayıcıda `/admin` sayfasına git
2. Şu anda authentication yok, direkt erişim var
3. Property'leri yönet

### Property Ekleme

1. "Add New Property" butonuna tıkla
2. Property bilgilerini doldur
3. Kaydet

### Property Düzenleme

1. Property listesinde "Edit" butonuna tıkla
2. Property bilgilerini düzenle
3. Kaydet

### Property Silme

1. Property listesinde "Delete" butonuna tıkla
2. Onayla
3. Property silinir

### Featured/Unfeatured Yapma

1. Property listesinde yıldız ikonuna tıkla
2. Property featured/unfeatured olur

### Verify/Unverify Yapma

1. Property listesinde göz ikonuna tıkla
2. Property verify/unverify olur

## 📊 API Endpoints

Admin panel şu API endpoint'lerini kullanıyor:

### GET /api/properties
Tüm property'leri getir

**Query Parameters:**
- `listingType`: "sale" veya "rent"
- `featured`: "true" veya "false"
- `area`: Area adı

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### GET /api/properties/[id]
Tek bir property getir

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### POST /api/properties
Yeni property oluştur

**Request Body:**
```json
{
  "title": "Property Title",
  "description": "Property Description",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### PUT /api/properties/[id]
Property güncelle

**Request Body:**
```json
{
  "title": "Updated Title",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

### DELETE /api/properties/[id]
Property sil

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

## 🔒 Güvenlik

### Production için Öneriler

1. **Authentication Ekleyin**
   - NextAuth.js veya Supabase Auth kullanın
   - Admin kullanıcıları için role-based access control

2. **API Routes'u Koruyun**
   - Authentication middleware ekleyin
   - Rate limiting ekleyin
   - Input validation ekleyin

3. **Database Güvenliği**
   - SQL injection koruması
   - XSS koruması
   - CSRF koruması

## 🎯 Gelecek Özellikler

1. **User Management**
   - Kullanıcı listesi
   - Kullanıcı düzenleme
   - Kullanıcı silme

2. **Analytics**
   - Property görüntülenme sayıları
   - En çok aranan property'ler
   - En çok favorilere eklenen property'ler

3. **Reports**
   - Günlük/haftalık/aylık raporlar
   - Property satış raporları
   - Kullanıcı aktivite raporları

4. **Settings**
   - Site ayarları
   - Email ayarları
   - Payment ayarları

## 📝 Notlar

- Şu anda mock data kullanılıyor
- Database'e bağlandığında gerçek verilerle çalışacak
- Authentication eklenmeli
- API routes'u database'e bağlanmalı


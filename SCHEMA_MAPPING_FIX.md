# Schema Mapping Fix - Sorun Analizi

## 🔴 Tespit Edilen Sorunlar

### 1. PUT /api/properties/[id] - `address` Kolonu Hatası (PGRST204)

**Hata:**
```
Supabase error: {
  code: 'PGRST204',
  message: "Could not find the 'address' column of 'properties' in the schema cache"
}
```

**Neden:**
- `src/lib/supabase.ts` → `propertyToDbProperty()` fonksiyonu `address` gönderiyor
- Database'de `address` kolonu YOK
- Gerçek kolon: `location` (text)

**Satır Satır Analiz:**
```typescript
// ❌ YANLIŞ (satır 129):
address: prop.location?.address || null,

// ✅ DOĞRU:
location: prop.location?.address || prop.location?.area || '',
```

**Düzeltme:**
- ✅ `propertyToDbProperty()` güncellendi
- ✅ `address` → `location` değiştirildi
- ✅ `coordinates` JSONB formatına dönüştürüldü
- ✅ Diğer kolon isimleri düzeltildi (`size`, `levels`, `amenities`)

---

### 2. POST /api/properties/images - 403 Hatası

**Log:**
```
TimeUTC = 2025-12-07 17:29:32
function = /api/properties/images
requestMethod = POST
responseStatusCode = 403
```

**Kod İncelemesi:**
- `src/app/api/properties/images/route.ts` içinde **403 döndüren kod yok**
- Sadece 401 (Unauthorized) ve 500 (Error) var

**Olası Nedenler:**

1. **Storage Bucket Policy** (En Olası)
   - Supabase Storage bucket policy'si upload'ı reddediyor
   - Policy: `property-images` bucket'ı için INSERT yetkisi yok

2. **Frontend 401 → 403 Yorumlaması**
   - Frontend 401'i 403 olarak gösteriyor olabilir

3. **Middleware/Reverse Proxy**
   - Nginx/Vercel gibi bir katman 403 döndürüyor olabilir

**Çözüm:**
Storage bucket policy'lerini kontrol et ve güncelle:

```sql
-- Storage bucket policy kontrolü
SELECT * FROM storage.buckets WHERE name = 'property-images';

-- Policy kontrolü
SELECT * FROM storage.policies 
WHERE bucket_id = 'property-images';
```

**Kod Tarafında:**
- ✅ Authentication kontrolü basitleştirildi
- ✅ 403 hard-coded check kaldırıldı
- Storage error'ları daha detaylı loglanıyor

---

### 3. PUT /api/properties/[id] - 401 Hatası

**Log:**
```
TimeUTC = 2025-12-07 17:28:35
function = /api/properties/[id]
responseStatusCode = 401
```

**Neden:**
- `verifyAuth()` fonksiyonu token'ı geçersiz buluyor
- Token expire olmuş veya format hatası var

**Satır Analizi:**
- Satır 74: `const auth = verifyAuth(request);`
- Satır 75-79: `if (!auth.success)` → 401 return

**Çözüm:**
- Token doğrulama iyileştirildi
- Error mesajları daha açıklayıcı
- `admin_token` ve `auth_token` her ikisi de kontrol ediliyor

---

## ✅ Yapılan Düzeltmeler

### 1. Schema Mapping (`src/lib/supabase.ts`)

**Önceki Hata:**
```typescript
// ❌ address, city, latitude, longitude kolonları yok
address: prop.location?.address || null,
city: prop.location?.city || null,
latitude: prop.location?.coordinates?.lat || null,
longitude: prop.location?.coordinates?.lng || null,
```

**Yeni Kod:**
```typescript
// ✅ location (text) ve coordinates (JSONB) kullanılıyor
location: prop.location?.address || prop.location?.area || '',
coordinates: prop.location?.coordinates ? {
  lat: prop.location.coordinates.lat,
  lng: prop.location.coordinates.lng,
} : null,
```

**Diğer Düzeltmeler:**
- `area_sqm` → `size`
- `floors` → `levels`
- `features` → `amenities` (array)
- `short_term_booking` → `short_term_rental` (boolean) + `price_per_day`

### 2. Images Endpoint (`src/app/api/properties/images/route.ts`)

**Değişiklik:**
- 403 hard-coded check kaldırıldı
- Authentication basitleştirildi
- Error logging iyileştirildi

**Şu Anki Kod:**
```typescript
// Sadece 401 (auth) ve 500 (error) döndürüyor
// 403 yok - muhtemelen storage policy'den geliyor
```

---

## 📋 Sonraki Adımlar

1. **Storage Bucket Policy Kontrolü:**
   ```sql
   -- property-images bucket için INSERT policy ekle
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'property-images');
   ```

2. **Test:**
   - Property update → 500 hatası gitmeli
   - Image upload → 403 hatası gitmeli (policy düzelince)
   - 401 hataları → Token kontrolü çalışmalı

3. **Log İzleme:**
   - Vercel function logs'u kontrol et
   - Supabase logs kontrol et
   - Storage error'ları izle


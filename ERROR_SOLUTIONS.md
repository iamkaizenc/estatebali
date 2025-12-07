# 🔧 Error Solutions - Hata Çözümleri

## ✅ 1. Image 404 Hatası - ÇÖZÜLDÜ

### Problem:
```
Failed to load resource: the server responded with a status of 404 ()
```

### Sebep:
- `/hero-background.mp4` video dosyası public klasöründe yok
- Video element'i 404 hatası veriyordu

### Çözüm:
✅ Video element'i kaldırıldı, direkt image kullanılıyor

**Değişiklik:**
- `src/app/[locale]/page.tsx` dosyasında video element'i kaldırıldı
- Direkt Unsplash image kullanılıyor
- Error handling eklendi

## 🔍 2. Webpack Runtime Hatası - ANALİZ GEREKLİ

### Hata:
```
at s (webpack-daa50970fa21d33c.js:1:152)
at 6194 (5445-f3481efe5f607fc9.js:1:200)
```

### Bu Hata Nedir?

Bu bir **production build** hatası. Minified JavaScript kodunda runtime hatası var.

### Olası Sebepler:

1. **Missing Dependency**
   - Bir paket eksik veya yanlış yüklü
   - Çözüm: `npm install` çalıştırın

2. **Dynamic Import Hatası**
   - `MapComponent` dynamic import ediliyor
   - SSR sorunu olabilir
   - Çözüm: Dynamic import yapısını kontrol edin

3. **Circular Dependency**
   - İki modül birbirini import ediyor
   - Çözüm: Import yapısını düzeltin

4. **Runtime JavaScript Hatası**
   - Production build'de çalışma zamanı hatası
   - Çözüm: Browser console'dan tam hatayı kontrol edin

### Debug Adımları:

#### Adım 1: Browser Console Kontrolü
```javascript
// Browser console'da (F12)
// Tam hata stack trace'ini kopyalayın
```

#### Adım 2: Network Tab Kontrolü
1. F12 → Network tab
2. Failed requests var mı kontrol edin
3. Hangi dosya yüklenemiyor?

#### Adım 3: Source Map Aktifleştir

`next.config.js` dosyasına ekleyin:
```javascript
const nextConfig = {
  // ... mevcut ayarlar
  productionBrowserSourceMaps: true, // Bu satırı ekleyin
}
```

Bu sayede production'da da daha okunabilir hata mesajları alırsınız.

#### Adım 4: Vercel Build Logs

1. Vercel Dashboard → Deployments
2. Latest deployment → Build Logs
3. Build sırasında hata var mı kontrol edin

### Muhtemel Sorunlar ve Çözümler:

#### Sorun: MapComponent Dynamic Import
**Konum:** `src/app/property/[id]/page.tsx:16`

```typescript
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});
```

**Çözüm:** MapComponent import path'ini kontrol edin.

#### Sorun: Missing Image Error Handling
**Konum:** `src/components/PropertyCard.tsx:130`

Next.js Image component'inde `onError` prop'u çalışmaz. Fallback URL kullanın:

```typescript
<Image
  src={getPropertyImage(property) || DEFAULT_PROPERTY_IMAGE}
  alt={property.title}
  fill
/>
```

## 🚀 Hızlı Çözümler

### 1. Image Error Handling Ekle

Tüm Image component'lerine fallback ekleyin:

```typescript
import { DEFAULT_PROPERTY_IMAGE } from "@/lib/constants";

<Image
  src={imageUrl || DEFAULT_PROPERTY_IMAGE}
  alt="..."
/>
```

### 2. Source Map Aktifleştir

`next.config.js`:
```javascript
productionBrowserSourceMaps: true
```

### 3. Build Test

```bash
npm run build
```

Build başarılı mı kontrol edin.

### 4. Dependency Kontrolü

```bash
npm audit
npm outdated
npm install
```

## 📝 Yapılacaklar

- [x] Image 404 hatası çözüldü (video element kaldırıldı)
- [ ] Browser console'dan tam webpack hatasını alın
- [ ] Source map'leri aktifleştirin
- [ ] Image component'lerine fallback ekleyin
- [ ] Build test yapın

## 🔗 İlgili Dosyalar

- `src/app/[locale]/page.tsx` - Video sorunu çözüldü
- `src/components/PropertyCard.tsx` - Image error handling gerekli
- `src/app/property/[id]/page.tsx` - Dynamic import kontrolü
- `next.config.js` - Source map eklenebilir


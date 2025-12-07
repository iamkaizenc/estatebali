# 🔍 Error Debug Guide

## Hatalar ve Çözümler

### 1. ✅ Image 404 Hatası - ÇÖZÜLDÜ

**Problem:**
- `/hero-background.mp4` dosyası public klasöründe yok
- Video yüklenemiyor ve 404 hatası veriyor

**Çözüm Uygulandı:**
- Video element'i kaldırıldı
- Direkt image kullanılıyor
- Error handling eklendi

### 2. 🔧 Webpack Runtime Hatası

**Hata:**
```
at s (webpack-daa50970fa21d33c.js:1:152)
at 6194 (5445-f3481efe5f607fc9.js:1:200)
```

**Olası Sebepler:**

#### A. Missing Dependency
- Bir paket eksik olabilir
- `npm install` çalıştırın

#### B. Circular Dependency
- İki modül birbirini import ediyor
- Import yapısını kontrol edin

#### C. Dynamic Import Hatası
- `dynamic()` import'ları başarısız olabilir
- Import path'leri kontrol edin

#### D. Runtime JavaScript Hatası
- Production build'de minified kod hatası
- Source map'ler olmadan debug zor

## 🔧 Debug Adımları

### Adım 1: Browser Console Kontrolü

1. Siteyi açın
2. F12 → Console tab
3. Tam hata mesajını kopyalayın
4. Network tab'da failed requests var mı kontrol edin

### Adım 2: Source Map Aktifleştir

`next.config.js`:
```javascript
productionBrowserSourceMaps: true
```

### Adım 3: Build Log Kontrolü

```bash
npm run build
```

Build sırasında hata var mı kontrol edin.

### Adım 4: Vercel Build Logs

Vercel Dashboard → Deployments → Latest → Build Logs

### Adım 5: Dependency Kontrolü

```bash
npm audit
npm outdated
```

## 📝 Image Error Handling

Next.js Image component'inde `onError` çalışmaz. Alternatif çözümler:

### Çözüm 1: Fallback URL Kullan
```tsx
<Image
  src={imageUrl || DEFAULT_FALLBACK_IMAGE}
  alt="..."
/>
```

### Çözüm 2: Custom Image Wrapper
```tsx
const SafeImage = ({ src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      src={imgSrc}
      onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
      {...props}
    />
  );
};
```

### Çözüm 3: Try-Catch Wrapper
```tsx
try {
  <Image src={imageUrl} />
} catch {
  <Image src={DEFAULT_FALLBACK_IMAGE} />
}
```

## 🚀 Hızlı Çözümler

### Image 404 için:
1. ✅ Video dosyası sorunu çözüldü
2. Image component'lerine fallback eklendi

### Webpack hatası için:
1. Browser console'da tam hatayı kontrol edin
2. Vercel build logs'u kontrol edin
3. Source map'leri aktifleştirin
4. Missing dependencies kontrol edin

## 📞 Destek

Hata devam ederse:
1. Browser console'dan tam hata mesajını paylaşın
2. Network tab'dan failed requests'leri kontrol edin
3. Vercel build logs'unu paylaşın


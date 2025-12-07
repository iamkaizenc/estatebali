# 🔍 404 Error Debug ve Çözüm

## Sorun

"Failed to load resource: the server responded with a status of 404 ()"

## Olası Nedenler

### 1. Next.js Image Optimization Hatası

**Belirti:**
- `_next/image?url=...` endpoint'leri 404 veriyor
- Unsplash veya external URL'ler optimize edilemiyor

**Çözüm:**
- External URL'ler için `unoptimized` prop kullanın
- Veya `next.config.js`'de remotePatterns kontrol edin

### 2. Static Dosyalar (favicon, logo, vb.)

**Kontrol:**
```bash
# Public klasöründe dosyalar var mı?
ls -la public/
```

**Beklenen Dosyalar:**
- `favicon.svg`
- `logo.svg`
- `robots.txt`
- `sitemap.xml`

### 3. API Route'ları

**Kontrol:**
- Browser console → Network tab → Failed requests
- Hangi endpoint 404 veriyor?

### 4. Area Images

**Kontrol:**
- `src/data/areaImages.ts` dosyasında image path'leri doğru mu?
- Images `public/` klasöründe mi?

## Debug Adımları

### Adım 1: Browser Console'u Aç

1. **F12** tuşuna basın
2. **Network** tab'ına gidin
3. Sayfayı yenileyin
4. **404** hatası veren request'i bulun
5. **Request URL**'i not edin

### Adım 2: Hangi Dosya 404 Veriyor?

**Yaygın 404 Kaynakları:**

1. **Favicon:**
   - URL: `/favicon.ico` veya `/favicon.svg`
   - Çözüm: `public/favicon.svg` var mı kontrol et

2. **Next.js Image:**
   - URL: `/_next/image?url=...`
   - Çözüm: `unoptimized` prop ekle veya remotePatterns kontrol et

3. **Static Assets:**
   - URL: `/logo.svg`, `/images/...`
   - Çözüm: `public/` klasöründe var mı kontrol et

4. **API Routes:**
   - URL: `/api/...`
   - Çözüm: API route dosyası var mı kontrol et

### Adım 3: Çözümü Uygula

**Eğer favicon.ico 404 veriyorsa:**
```typescript
// next.config.js veya layout.tsx'te
// Favicon zaten favicon.svg olarak ayarlanmış
// Ama browser favicon.ico istiyorsa:
```

**Eğer Next.js Image 404 veriyorsa:**
```tsx
// Image component'inde unoptimized ekle
<Image
  src="..."
  unoptimized // External URL'ler için
/>
```

**Eğer static dosya 404 veriyorsa:**
- Dosyayı `public/` klasörüne ekle
- Path'i kontrol et (başında `/` olmalı)

## Hızlı Kontrol Script

**Browser Console'da çalıştırın:**
```javascript
// Tüm 404 hatalarını göster
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('404') || r.name.endsWith('.svg') || r.name.endsWith('.ico'))
  .forEach(r => console.log('404 or missing:', r.name));
```

## Yaygın Çözümler

### Çözüm 1: Favicon.ico Eksik

Browser otomatik olarak `/favicon.ico` arar. Eğer yoksa 404 verir.

**Çözüm:**
- `public/favicon.ico` dosyası ekle VEYA
- HTML'de explicit favicon link ekle

### Çözüm 2: Next.js Image Optimization

External URL'ler optimize edilemezse 404 verir.

**Çözüm:**
```tsx
<Image
  src="https://images.unsplash.com/..."
  unoptimized // Ekle
  ...
/>
```

### Çözüm 3: Missing Static Files

**Kontrol:**
```bash
# Proje root'unda
ls -la public/
```

**Eksik dosyalar varsa ekleyin.**

## İletişim

Sorun devam ederse, şu bilgileri paylaşın:
1. Browser console → Network tab → 404 hatası veren request URL'i
2. Hangi sayfada hatayı görüyorsunuz?
3. Request'in tam URL'i nedir?


# 🗺️ Map Functions & Routes - Tüm Referanslar

Bu dosya, map ile ilgili tüm fonksiyonları, route'ları ve navigation'ları içerir. Manuel düzenleme için referans.

---

## 📁 Dosya Yapısı

### Map Component
- **Dosya:** `src/components/MapComponent.tsx`
- **Kullanım:** Map görüntüleme ve marker gösterimi

### Map Sayfası
- **Dosya:** `src/app/map/page.tsx`
- **Route:** `/map`
- **Kullanım:** Map search sayfası

### Buy Sayfası
- **Dosya:** `src/app/buy/page.tsx`
- **Route:** `/buy`
- **Filtre:** `listingType: "sale"`

### Rent Sayfası
- **Dosya:** `src/app/rent/page.tsx`
- **Route:** `/rent`
- **Filtre:** `listingType: "rent"`

### Rent Motorbike Sayfası
- **Dosya:** `src/app/rent-motorbike/page.tsx`
- **Route:** `/rent-motorbike`
- **Kullanım:** Motorbike rental landing page

---

## 🔗 Route'lar ve Navigation

### 1. Map Sayfası Route

**Route:** `/map`

**Link'ler:**
```tsx
// Header.tsx (Desktop)
<Link href="/map" className="hover:text-primary transition-colors">
  Map Search
</Link>

// Header.tsx (Mobile)
<Link href="/map" className="py-2 hover:text-primary transition-colors">
  Map Search
</Link>

// Footer.tsx
<Link href="/map" className="hover:text-primary transition-colors">
  Map Search
</Link>

// SearchBar.tsx (Map Icon Button)
<button
  onClick={() => window.location.href = "/map"}
  className="p-3 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
  title="Map Search"
>
  <MapPin className="h-5 w-5" />
</button>
```

### 2. Buy Sayfası Route

**Route:** `/buy`

**Link'ler:**
```tsx
// Header.tsx (Desktop)
<Link href="/buy" className="hover:text-primary transition-colors">
  Buy
</Link>

// Header.tsx (Mobile)
<Link href="/buy" className="py-2 hover:text-primary transition-colors">
  Buy
</Link>

// Footer.tsx
<Link href="/buy" className="hover:text-primary transition-colors">
  Buy Property
</Link>
```

**Sayfa Komponenti:**
```tsx
// src/app/buy/page.tsx
export default function BuyPage() {
  const { properties: saleProperties, loading, error } = useProperties({ listingType: "sale" });
  
  return (
    // Sale properties gösterilir
  );
}
```

### 3. Rent Motorbike Sayfası Route

**Route:** `/rent-motorbike`

**Link'ler:**
```tsx
// Header.tsx (Desktop)
<Link href="/rent-motorbike" className="hover:text-primary transition-colors">
  Rent Motorbike
</Link>

// Header.tsx (Mobile)
<Link href="/rent-motorbike" className="py-2 hover:text-primary transition-colors">
  Rent Motorbike
</Link>

// Footer.tsx
<Link href="/rent-motorbike" className="hover:text-primary transition-colors">
  Rent Motorbike
</Link>
```

**Sayfa Komponenti:**
```tsx
// src/app/rent-motorbike/page.tsx
export default function RentMotorbikePage() {
  return (
    // Motorbike rental landing page
  );
}
```

### 4. Rent Sayfası Route

**Route:** `/rent`

**Link'ler:**
```tsx
// Header.tsx (Desktop)
<Link href="/rent" className="hover:text-primary transition-colors">
  Rent
</Link>

// Header.tsx (Mobile)
<Link href="/rent" className="py-2 hover:text-primary transition-colors">
  Rent
</Link>

// Footer.tsx
<Link href="/rent" className="hover:text-primary transition-colors">
  Rent Property
</Link>
```

**Sayfa Komponenti:**
```tsx
// src/app/rent/page.tsx
export default function RentPage() {
  const { properties: rentProperties, loading, error } = useProperties({ listingType: "rent" });
  
  return (
    // Rent properties gösterilir
  );
}
```

---

## 🔍 Search Fonksiyonları

### SearchBar Component

**Dosya:** `src/components/SearchBar.tsx`

**Props:**
```tsx
interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}
```

**Tab Buttons (All/Sale/Rent):**
```tsx
// All Properties
<button onClick={() => setActiveTab("all")}>
  All
</button>

// For Sale
<button onClick={() => setActiveTab("sale")}>
  For Sale
</button>

// For Rent
<button onClick={() => setActiveTab("rent")}>
  For Rent
</button>
```

**Search Handler:**
```tsx
const handleSearch = () => {
  if (onSearch) {
    const filters: SearchFilters = {
      query: searchQuery || undefined,
      listingType: activeTab === "all" ? undefined : activeTab,
      propertyType: filterState.propertyType ? [filterState.propertyType as any] : undefined,
      bedrooms: filterState.bedrooms ? parseInt(filterState.bedrooms) : undefined,
      priceMin: filterState.priceMin ? parseInt(filterState.priceMin) : undefined,
      priceMax: filterState.priceMax ? parseInt(filterState.priceMax) : undefined,
      location: searchQuery || undefined,
    };
    onSearch(filters);
  }
};
```

**Map Button:**
```tsx
<button
  onClick={() => window.location.href = "/map"}
  className="p-3 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
  title="Map Search"
>
  <MapPin className="h-5 w-5" />
</button>
```

### Home Page Search Handler

**Dosya:** `src/app/[locale]/page.tsx`

```tsx
const handleSearch = (filters: SearchFilters) => {
  const params = new URLSearchParams();
  
  if (filters.query) params.set("q", filters.query);
  if (filters.listingType) params.set("listingType", filters.listingType);
  if (filters.propertyType && filters.propertyType.length > 0) {
    params.set("type", filters.propertyType.join(","));
  }
  if (filters.bedrooms) params.set("bedrooms", filters.bedrooms.toString());
  if (filters.priceMin) params.set("priceMin", filters.priceMin.toString());
  if (filters.priceMax) params.set("priceMax", filters.priceMax.toString());
  if (filters.location) params.set("location", filters.location);
  
  router.push(`/${locale}/properties?${params.toString()}`);
};
```

**Kullanım:**
```tsx
<SearchBar onSearch={handleSearch} />
```

### Properties Page Search Handler

**Dosya:** `src/app/properties/page.tsx`

```tsx
<SearchBar onSearch={(searchFilters) => {
  // Filters uygulanır
  // URL parametreleri güncellenir
}} />
```

---

## 🗺️ Map Component Fonksiyonları

### MapComponent Props

**Dosya:** `src/components/MapComponent.tsx`

```tsx
interface MapComponentProps {
  properties: Property[];
}
```

### Area Coordinates

**Default Bali koordinatları:**
```tsx
const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  "Seminyak": { lat: -8.6846, lng: 115.1702 },
  "Canggu": { lat: -8.6489, lng: 115.1382 },
  "Ubud": { lat: -8.5069, lng: 115.2625 },
  "Sanur": { lat: -8.6899, lng: 115.2604 },
  "Uluwatu": { lat: -8.8294, lng: 115.0851 },
  "Nusa Dua": { lat: -8.7919, lng: 115.2245 },
  "Jimbaran": { lat: -8.8045, lng: 115.1768 },
  "Kuta": { lat: -8.7222, lng: 115.1687 },
  "Denpasar": { lat: -8.6705, lng: 115.2126 },
  "Pecatu": { lat: -8.8424, lng: 115.0932 },
  "Pererenan": { lat: -8.6444, lng: 115.1394 },
  "Berawa": { lat: -8.6525, lng: 115.1442 },
  "Mengwi": { lat: -8.5725, lng: 115.1836 },
  "Tabanan": { lat: -8.5411, lng: 115.1259 },
  "Gianyar": { lat: -8.5419, lng: 115.3222 },
};
```

### Get Property Coordinates Function

```tsx
function getPropertyCoordinates(property: Property): { lat: number; lng: number } | null {
  // 1. Önce property'nin coordinates'ini kullan
  if (property.location.coordinates) {
    return property.location.coordinates;
  }
  
  // 2. Area-based fallback
  const area = property.location.area;
  if (area && areaCoordinates[area]) {
    return areaCoordinates[area];
  }
  
  // 3. City-based fallback
  const city = property.location.city;
  if (city === "Denpasar") {
    return areaCoordinates["Denpasar"];
  }
  
  // 4. Default to Bali center
  return { lat: -8.3405, lng: 115.092 };
}
```

### Map Marker Popup Content

**Popup içeriği:**
```tsx
marker.bindPopup(`
  <div style="color: #000; min-width: 200px;">
    <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${property.title}</h3>
    <p style="margin-bottom: 4px; color: #666; font-size: 14px;">
      ${property.location.area || ''}${property.location.city ? `, ${property.location.city}` : ''}
    </p>
    <p style="color: #00FF66; font-weight: bold; margin-bottom: 8px; font-size: 16px;">
      ${formatPrice(property.price)}
      ${property.listingType === "rent" ? "/mo" : ""}
    </p>
    <a href="/property/${property.id}" style="color: #00FF66; text-decoration: underline; font-size: 14px;">
      View Details →
    </a>
  </div>
`);
```

**Property detail link:** `/property/${property.id}`

---

## 📍 Properties Hook

### useProperties Hook

**Dosya:** `src/hooks/useProperties.ts`

**Kullanım:**
```tsx
// Tüm properties
const { properties, loading, error } = useProperties();

// Sale properties
const { properties: saleProperties, loading, error } = useProperties({ listingType: "sale" });

// Rent properties
const { properties: rentProperties, loading, error } = useProperties({ listingType: "rent" });

// Filtreli properties
const { properties, loading, error } = useProperties({
  listingType: "sale",
  propertyType: ["villa"],
  bedrooms: 3,
  priceMin: 1000000000,
  priceMax: 5000000000,
});
```

---

## 🔄 Navigation Flow

### Buy Button → Buy Page
1. User clicks "Buy" button (Header/Footer)
2. Navigate to `/buy`
3. `BuyPage` component loads
4. Fetches properties with `listingType: "sale"`
5. Displays `PropertyCard` components

### Rent Button → Rent Page
1. User clicks "Rent" button (Header/Footer)
2. Navigate to `/rent`
3. `RentPage` component loads
4. Fetches properties with `listingType: "rent"`
5. Displays `PropertyCard` components

### Map Button → Map Page
1. User clicks Map icon (SearchBar)
2. Navigate to `/map`
3. `MapPage` component loads
4. Fetches all properties
5. Displays `MapComponent` with markers
6. Displays `PropertyCard` components below map

### Search → Properties Page
1. User searches from Home page
2. `handleSearch` function called with filters
3. URL params built: `?q=...&listingType=...&type=...`
4. Navigate to `/${locale}/properties?${params}`
5. Properties page filters and displays results

### Map Marker → Property Detail
1. User clicks marker on map
2. Popup shows property info
3. User clicks "View Details →"
4. Navigate to `/property/${property.id}`
5. Property detail page loads

---

## 🎨 Customization Points

### Map Center
```tsx
// MapComponent.tsx - line 76
center: [-8.3405, 115.092],  // Bali center
zoom: 10,
```

### Default Coordinates
```tsx
// MapComponent.tsx - line 49
return { lat: -8.3405, lng: 115.092 };  // Default fallback
```

### Map Tile Provider
```tsx
// MapComponent.tsx - line 81
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(mapInstanceRef.current);
```

### Map Height
```tsx
// MapComponent.tsx - line 155
<div ref={mapRef} className="h-[70vh] w-full rounded-2xl bg-dark-100" />
```

---

## 📝 Notlar

1. **Map Component SSR:** Dynamic import kullanılıyor (SSR sorunları için)
2. **Markers:** Her property için marker oluşturuluyor
3. **Popup Link:** Marker popup'ında property detail linki var
4. **Filtering:** Buy/Rent sayfaları `useProperties` hook'u ile filtreliyor
5. **Search:** SearchBar component'i tüm sayfalarda kullanılabilir

---

## 🔧 Düzenleme Yapılacak Yerler

### 1. Map Route Değiştirmek
- `src/components/SearchBar.tsx` - line 96
- `src/components/Header.tsx` - lines 46, 171
- `src/components/Footer.tsx` - line 126

### 2. Buy Route Değiştirmek
- `src/components/Header.tsx` - lines 40, 157
- `src/components/Footer.tsx` - line 106

### 3. Rent Route Değiştirmek
- `src/components/Header.tsx` - lines 43, 164
- `src/components/Footer.tsx` - line 111

### 4. Map Marker Popup Link
- `src/components/MapComponent.tsx` - line 120

### 5. Map Coordinates
- `src/components/MapComponent.tsx` - lines 11-27 (areaCoordinates)
- `src/components/MapComponent.tsx` - line 49 (default fallback)
- `src/components/MapComponent.tsx` - line 76 (map center)

### 6. Search Navigation
- `src/app/[locale]/page.tsx` - line 35 (handleSearch)
- `src/app/properties/page.tsx` - line 56 (SearchBar onSearch)

---

## 🚀 Hızlı Referans

```tsx
// Routes
/map          → Map search page
/buy          → Properties for sale
/rent         → Properties for rent
/properties   → All properties with filters
/property/:id → Property detail page

// Components
<MapComponent properties={properties} />
<SearchBar onSearch={handleSearch} />
<PropertyCard property={property} />

// Hooks
useProperties({ listingType: "sale" })
useProperties({ listingType: "rent" })
```


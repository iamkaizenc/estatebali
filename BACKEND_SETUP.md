# Backend ve Database Kurulum Rehberi

## 📋 Mevcut Durum

Şu anda uygulama **mock data** (sahte veri) kullanıyor. Production için gerçek bir backend ve database gerekiyor.

## 🎯 Seçenekler

### Seçenek 1: Next.js API Routes (Önerilen - Aynı Proje)

**Avantajlar:**
- ✅ Aynı proje içinde, kolay yönetim
- ✅ Vercel'de otomatik deploy
- ✅ Serverless functions
- ✅ Ücretsiz tier mevcut

**Kurulum:**
1. Database seçin (Supabase, MongoDB Atlas, PostgreSQL)
2. API routes zaten oluşturuldu: `/src/app/api/properties/`
3. Database bağlantısını ekleyin
4. Environment variables ekleyin

### Seçenek 2: Ayrı Backend (Node.js/Express)

**Avantajlar:**
- ✅ Daha fazla kontrol
- ✅ Ayrı scaling
- ✅ Mikroservis mimarisi

**Dezavantajlar:**
- ❌ Ayrı deployment
- ❌ Daha karmaşık yapı
- ❌ Ekstra maliyet

### Seçenek 3: Full-Stack Framework (Next.js + Prisma)

**Avantajlar:**
- ✅ Type-safe database client
- ✅ Migration yönetimi
- ✅ Otomatik API generation

## 🗄️ Database Seçenekleri

### 1. Supabase (Önerilen)

**Özellikler:**
- PostgreSQL database
- Authentication
- Real-time subscriptions
- Storage
- Ücretsiz tier: 500MB database

**Kurulum:**
```bash
npm install @supabase/supabase-js
```

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. MongoDB Atlas

**Özellikler:**
- NoSQL database
- Kolay kurulum
- Ücretsiz tier: 512MB

**Kurulum:**
```bash
npm install mongodb
# veya
npm install mongoose
```

### 3. PostgreSQL (Vercel Postgres)

**Özellikler:**
- SQL database
- Vercel ile entegre
- Ücretsiz tier mevcut

**Kurulum:**
```bash
npm install @vercel/postgres
# veya
npm install pg
```

## 📦 Önerilen Kurulum: Supabase + Next.js API Routes

### Adım 1: Supabase Hesabı Oluştur

1. [supabase.com](https://supabase.com) adresine git
2. Hesap oluştur
3. Yeni proje oluştur
4. Database URL ve API key'leri al

### Adım 2: Database Schema Oluştur

Supabase SQL Editor'de çalıştır:

```sql
-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  listing_type VARCHAR(20) NOT NULL,
  source VARCHAR(20) NOT NULL,
  price BIGINT NOT NULL,
  price_per_month BIGINT,
  price_per_sqm BIGINT,
  address TEXT,
  area VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm INTEGER,
  floors INTEGER,
  year_built INTEGER,
  furnished BOOLEAN,
  features JSONB,
  images TEXT[],
  videos TEXT[],
  virtual_tour TEXT,
  short_term_booking JSONB,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  contact_whatsapp VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_available ON properties(available);

-- Users table (for admin authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Adım 3: Supabase Client Kurulumu

```bash
npm install @supabase/supabase-js
```

### Adım 4: Environment Variables

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Adım 5: Supabase Client Oluştur

`src/lib/supabase.ts` dosyası oluştur:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Adım 6: API Routes'u Güncelle

`src/app/api/properties/route.ts` dosyasını güncelle:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingType = searchParams.get("listingType");
    const featured = searchParams.get("featured");

    let query = supabase.from("properties").select("*");

    if (listingType) {
      query = query.eq("listing_type", listingType);
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
```

## 🔐 Admin Panel Authentication

### Seçenek 1: Supabase Auth

```bash
npm install @supabase/auth-helpers-nextjs
```

### Seçenek 2: NextAuth.js

```bash
npm install next-auth
```

## 📱 Mobile App Backend

Eğer mobil uygulama (React Native, Flutter) varsa:

1. **Aynı Backend Kullan**: Next.js API routes'u hem web hem mobile için kullan
2. **REST API**: Mevcut API routes'ları kullan
3. **Authentication**: JWT token ile auth

## 🚀 Deployment

### Vercel Deployment

1. Environment variables'ı Vercel'e ekle
2. Database connection string'i ekle
3. Deploy et

### Database Deployment

- **Supabase**: Otomatik deploy
- **MongoDB Atlas**: Cloud'da otomatik
- **Vercel Postgres**: Vercel ile entegre

## 📊 Monitoring ve Analytics

- **Vercel Analytics**: Otomatik
- **Supabase Dashboard**: Database monitoring
- **Sentry**: Error tracking (opsiyonel)

## 🔄 Migration Strategy

1. Mevcut mock data'yı database'e aktar
2. API routes'u database'e bağla
3. Test et
4. Production'a deploy et

## 📝 Next Steps

1. ✅ Supabase hesabı oluştur
2. ✅ Database schema oluştur
3. ✅ Supabase client kur
4. ✅ API routes'u güncelle
5. ✅ Admin panel authentication ekle
6. ✅ Test et
7. ✅ Deploy et

## 🆘 Yardım

Sorularınız için:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Deployment](https://vercel.com/docs)


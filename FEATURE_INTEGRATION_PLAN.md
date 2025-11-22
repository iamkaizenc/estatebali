# Estate Bali - Feature Integration Plan
## Website ← Mobile App Entegrasyonu

**Tarih**: 22 Kasım 2025
**Kaynak**: Estate-Bali (React Native App)
**Hedef**: estatebali (Next.js Website)

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ Website'de MEVCUT Özellikler
1. **Authentication**: JWT + Email/Password
2. **Property Management**: CRUD, görüntüleme sayacı
3. **Favorites System**: Favorilere ekleme/çıkarma
4. **User Profile**: Profil görüntüleme/düzenleme
5. **Multi-language**: 5 dil (EN, ID, HE, AR, ZH)
6. **Map Search**: Leaflet harita entegrasyonu
7. **Email Service**: SendGrid entegrasyonu
8. **Admin Panel**: Temel admin özellikleri
9. **Search & Filtering**: Gelişmiş filtreleme

### ❌ Mobile App'te OLUP Website'de EKSİK Özellikler

#### 🔴 HIGH PRIORITY

1. **Investment Lead System**
   - Form: InvestmentLeadForm component
   - Database: investment_leads tablosu
   - API: investment-leads.ts service
   - **Kullanım**: Potansiyel yatırımcı kaydı

2. **Notifications System**
   - Database: notifications tablosu
   - Real-time bildirimler
   - Bildirim tercihleri
   - **Kullanım**: Kullanıcı bildirimleri

3. **Bookings System**
   - Database: bookings tablosu
   - API: bookings.ts service
   - **Kullanım**: Kısa dönem kiralama rezervasyonları

4. **Saved Searches**
   - Database: saved_searches tablosu
   - API: saved-searches.ts service
   - **Kullanım**: Arama filtrelerini kaydetme

5. **Conversations/Messaging**
   - Database: conversations + messages tabloları
   - API: conversations.ts + messages.ts
   - Real-time messaging
   - **Kullanım**: Kullanıcılar arası mesajlaşma

6. **Gelişmiş Property Özellikleri**
   ```typescript
   // Mobile app'teki ekstra alanlar:
   - leaseholdYears: number (Leasehold yılı)
   - leaseholdExtendable: boolean
   - energyClass: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
   - heatingType: 'autonomous' | 'central' | 'none'
   - heatingMedium: 'oil' | 'gas' | 'electric' | 'solar' | 'none'
   - newDevelopment: boolean
   - hasWarehouse: boolean
   - hasSecurityDoor: boolean
   - hasAlarm: boolean
   - hasFireplace: boolean
   - hasSolarWaterHeater: boolean
   - hasPenthouse: boolean
   - suitableForStudents: boolean
   - wheelchairAccessible: boolean
   - averageMonthlyExpenses: number
   - distanceFromSea: string
   - availableFrom: string
   - priceReduced: boolean
   ```

7. **Scooter/Motorcycle Rentals**
   - Tamamen yeni kategori
   - Database: motorcycles tablosu
   - **Kullanım**: Scooter kiralama özelliği

8. **Admin Approval System**
   - Property onay sistemi
   - Moderation queue
   - **Kullanım**: Admin property onayı

#### 🟡 MEDIUM PRIORITY

9. **OAuth Integration**
   - Google Sign-In
   - Apple Sign-In
   - **Kullanım**: Sosyal medya ile giriş

10. **Advanced Analytics**
    - Admin analytics sayfası
    - User behavior tracking
    - **Kullanım**: Platform metrikleri

11. **User Profiles (Extended)**
    - Avatar upload
    - Agency information
    - Bio/About
    - **Kullanım**: Detaylı profil sayfaları

12. **Property Verification System**
    - Verified badge
    - Verification process
    - **Kullanım**: Güvenilir ilanlar

---

## 🚀 ENTEGRASYON PLANI

### PHASE 1: Database Şeması (1-2 gün)

#### 1.1 Yeni Tablolar Ekle
```sql
-- Investment Leads
CREATE TABLE investment_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  investment_amount BIGINT,
  investment_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES auth.users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price BIGINT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved Searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  alert_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (zaten var, güncelleme gerekebilir)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id);
```

#### 1.2 Properties Tablosunu Genişlet
```sql
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS leasehold_years INTEGER,
ADD COLUMN IF NOT EXISTS leasehold_extendable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS energy_class TEXT,
ADD COLUMN IF NOT EXISTS heating_type TEXT,
ADD COLUMN IF NOT EXISTS heating_medium TEXT,
ADD COLUMN IF NOT EXISTS new_development BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_warehouse BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_security_door BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_alarm BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_fireplace BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_solar_water_heater BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_penthouse BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS suitable_for_students BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS average_monthly_expenses BIGINT,
ADD COLUMN IF NOT EXISTS distance_from_sea TEXT,
ADD COLUMN IF NOT EXISTS available_from TEXT,
ADD COLUMN IF NOT EXISTS price_reduced BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved'; -- pending, approved, rejected
```

### PHASE 2: Backend API Routes (2-3 gün)

#### 2.1 Investment Leads API
```typescript
// src/app/api/investment-leads/route.ts
export async function POST(request: Request) {
  // Create investment lead
}

export async function GET(request: Request) {
  // Get all investment leads (admin only)
}
```

#### 2.2 Notifications API
```typescript
// src/app/api/notifications/route.ts
export async function GET(request: Request) {
  // Get user notifications
}

// src/app/api/notifications/[id]/route.ts
export async function PATCH(request: Request) {
  // Mark as read
}
```

#### 2.3 Bookings API
```typescript
// src/app/api/bookings/route.ts
export async function POST(request: Request) {
  // Create booking
}

export async function GET(request: Request) {
  // Get user bookings
}
```

#### 2.4 Saved Searches API
```typescript
// src/app/api/saved-searches/route.ts
export async function POST(request: Request) {
  // Save search
}

export async function GET(request: Request) {
  // Get saved searches
}
```

#### 2.5 Conversations API
```typescript
// src/app/api/conversations/route.ts
// src/app/api/conversations/[id]/route.ts
// src/app/api/conversations/[id]/messages/route.ts
```

### PHASE 3: Frontend Components (3-4 gün)

#### 3.1 Investment Lead Form
```typescript
// src/components/InvestmentLeadForm.tsx
// src/components/InvestmentConsultation.tsx
```

#### 3.2 Notifications
```typescript
// src/components/NotificationBell.tsx
// src/components/NotificationList.tsx
// src/app/notifications/page.tsx
```

#### 3.3 Bookings
```typescript
// src/components/BookingForm.tsx
// src/components/BookingCalendar.tsx
// src/app/user/bookings/page.tsx
```

#### 3.4 Saved Searches
```typescript
// src/components/SaveSearchButton.tsx
// src/app/user/saved-searches/page.tsx
```

#### 3.5 Conversations
```typescript
// src/components/ConversationList.tsx
// src/components/MessageThread.tsx
// src/app/user/conversations/page.tsx
// src/app/user/conversations/[id]/page.tsx
```

### PHASE 4: Enhanced Property Features (2 gün)

#### 4.1 Property Types Güncelle
```typescript
// src/types/index.ts - eklemeler
export interface Property {
  // ... mevcut alanlar
  leaseholdYears?: number;
  leaseholdExtendable?: boolean;
  energyClass?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  heatingType?: 'autonomous' | 'central' | 'none';
  heatingMedium?: 'oil' | 'gas' | 'electric' | 'solar' | 'none';
  newDevelopment?: boolean;
  // ... diğer yeni alanlar
}
```

#### 4.2 Create/Edit Forms Güncelle
```typescript
// src/app/create/page.tsx - form alanları ekle
// src/app/property/[id]/edit/page.tsx - form alanları ekle
```

#### 4.3 Property Detail Sayfası Güncelle
```typescript
// src/app/property/[id]/page.tsx - yeni alanları göster
```

### PHASE 5: Admin Features (1-2 gün)

#### 5.1 Property Approval
```typescript
// src/app/admin/approvals/page.tsx
// API: src/app/api/admin/properties/[id]/approve/route.ts
```

#### 5.2 Investment Leads Management
```typescript
// src/app/admin/leads/page.tsx
```

#### 5.3 Analytics Dashboard
```typescript
// src/app/admin/analytics/page.tsx
```

### PHASE 6: OAuth Integration (1 gün)

#### 6.1 NextAuth.js Setup
```typescript
// src/app/api/auth/[...nextauth]/route.ts
// Google Provider
// Apple Provider (web için)
```

---

## 📋 ÖNCELİK SIRASI

### MUST HAVE (İlk Deploy Öncesi)
1. ✅ Investment Lead System
2. ✅ Notifications System
3. ✅ Conversations/Messaging
4. ✅ Enhanced Property Fields
5. ✅ Property Approval System

### SHOULD HAVE (İlk Güncelleme)
1. ✅ Bookings System
2. ✅ Saved Searches
3. ✅ OAuth Integration
4. ✅ Admin Analytics

### NICE TO HAVE (Gelecek Güncellemeler)
1. ⏳ Scooter/Motorcycle Rentals
2. ⏳ Virtual Tours
3. ⏳ Property Comparison Tool
4. ⏳ Investment Portfolio Dashboard

---

## 🛠️ TEKNİK GEREKSINIMLER

### Dependencies Ekle
```json
{
  "next-auth": "^5.0.0", // OAuth için
  "pusher-js": "^8.4.0", // Real-time notifications
  "@pusher/push-notifications-web": "^1.1.0", // Web push
  "react-big-calendar": "^1.13.0", // Booking calendar
  "date-fns": "^3.0.0" // Date utilities
}
```

### Environment Variables
```bash
# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Real-time
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=

# Notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

---

## 📅 TAHMINI SÜRE

- **Phase 1 (Database)**: 1-2 gün
- **Phase 2 (Backend API)**: 2-3 gün
- **Phase 3 (Frontend)**: 3-4 gün
- **Phase 4 (Property Enhancement)**: 2 gün
- **Phase 5 (Admin)**: 1-2 gün
- **Phase 6 (OAuth)**: 1 gün
- **Testing & Bug Fixes**: 2-3 gün

**TOPLAM**: 12-17 gün (2-3 hafta)

---

## ✅ BAŞLANGIÇ KONTROL LİSTESİ

### Hemen Yapılacaklar
- [ ] Database migration dosyası oluştur
- [ ] TypeScript types güncelle
- [ ] API routes klasör yapısı oluştur
- [ ] Component klasörleri oluştur
- [ ] Test verisi hazırla

### İlk Sprint (1 hafta)
- [ ] Investment Leads implementasyonu
- [ ] Notifications sistemi
- [ ] Enhanced property fields
- [ ] Database migrations çalıştır

### İkinci Sprint (1 hafta)
- [ ] Conversations/Messaging
- [ ] Bookings system
- [ ] Saved searches
- [ ] Admin approval

---

**Son Güncelleme**: 22 Kasım 2025
**Versiyon**: 1.0
**Hazırlayan**: Claude Code AI Assistant

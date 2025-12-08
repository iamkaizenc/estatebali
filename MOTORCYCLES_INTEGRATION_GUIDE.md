# 🏍️ Motorcycles Feature - Complete Integration Guide

## 📋 İçindekiler
1. [Database Schema](#database-schema)
2. [API Routes](#api-routes)
3. [Frontend Components](#frontend-components)
4. [TypeScript Types](#typescript-types)
5. [Migration Checklist](#migration-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Deployment Checklist](#deployment-checklist)

---

## 🗄️ Database Schema

### **motorcycles Table**

```sql
CREATE TABLE motorcycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  daily_price integer,
  weekly_price integer,
  monthly_price integer,
  location text NOT NULL DEFAULT 'Canggu',
  type text CHECK (type IN ('scooter', 'motorcycle', 'car')),
  brand text,
  model text,
  year integer,
  cc integer,
  fuel_type text DEFAULT 'petrol',
  transmission text CHECK (transmission IN ('automatic', 'manual')),
  images text[] DEFAULT ARRAY[]::text[],
  features text[] DEFAULT ARRAY[]::text[],
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  deposit_required integer,
  insurance_included boolean DEFAULT true,
  helmet_included boolean DEFAULT true,
  min_rental_days integer DEFAULT 1,
  max_rental_days integer,
  user_id uuid REFERENCES users(id),
  contact_whatsapp text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **Indexes**

```sql
CREATE INDEX idx_motorcycles_system_code ON motorcycles(system_code);
CREATE INDEX idx_motorcycles_available ON motorcycles(available);
CREATE INDEX idx_motorcycles_type ON motorcycles(type);
CREATE INDEX idx_motorcycles_location ON motorcycles(location);
CREATE INDEX idx_motorcycles_price ON motorcycles(price);
```

### **RLS Policies**

```sql
-- Public can view available motorcycles
CREATE POLICY "Public can view available motorcycles"
  ON motorcycles FOR SELECT
  USING (available = true);

-- Authenticated can create motorcycles
CREATE POLICY "Authenticated can create motorcycles"
  ON motorcycles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can view all motorcycles
CREATE POLICY "Admins can view all motorcycles"
  ON motorcycles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Users can update own motorcycles
CREATE POLICY "Users can update own motorcycles"
  ON motorcycles FOR UPDATE
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Users can delete own motorcycles
CREATE POLICY "Users can delete own motorcycles"
  ON motorcycles FOR DELETE
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
```

---

## 🔌 API Routes

### **GET /api/motorcycles**
**Public endpoint** - Fetches motorcycles with filters

**Query Parameters:**
- `type` - Filter by type: `scooter`, `motorcycle`, `car`
- `location` - Filter by location
- `available` - Filter by availability: `true` (only available), `false` (only unavailable), or omit (all)
- `featured` - Filter featured motorcycles: `true`
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort order: `newest`, `price-asc`, `price-desc`, `popular`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "system_code": "MC001",
      "title": "Honda Scoopy",
      "description": "...",
      "price": 80000,
      "daily_price": 80000,
      "weekly_price": 500000,
      "monthly_price": 2000000,
      "location": "Canggu",
      "type": "scooter",
      "brand": "Honda",
      "model": "Scoopy",
      "year": 2023,
      "cc": 125,
      "fuel_type": "petrol",
      "transmission": "automatic",
      "images": ["https://..."],
      "features": ["GPS", "USB Charger"],
      "available": true,
      "featured": false,
      "deposit_required": 500000,
      "insurance_included": true,
      "helmet_included": true,
      "min_rental_days": 1,
      "max_rental_days": 30,
      "contact_whatsapp": "+6281234567890",
      "views": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Notes:**
- If `available` parameter is NOT provided, shows ALL motorcycles (for admin panel)
- If `available=true`, shows only available motorcycles (for public pages)
- Uses `supabaseAdmin` (service role) to bypass RLS

### **POST /api/motorcycles**
**Admin only** - Creates new motorcycle

**Headers:**
```
Authorization: Bearer <admin_token or auth_token>
Content-Type: application/json
```

**Body:**
```json
{
  "system_code": "MC001",
  "title": "Honda Scoopy",
  "description": "...",
  "price": 80000,
  "location": "Canggu",
  "type": "scooter",
  "images": [],
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created motorcycle object */ }
}
```

### **GET /api/motorcycles/[id]**
**Public endpoint** - Fetches single motorcycle

**Response:**
```json
{
  "success": true,
  "data": { /* motorcycle object */ }
}
```

### **PUT /api/motorcycles/[id]**
**Admin only** - Updates motorcycle (supports partial updates)

**Headers:**
```
Authorization: Bearer <admin_token or auth_token>
Content-Type: application/json
```

**Body:** (All fields optional - partial update)
```json
{
  "title": "Updated Title",
  "price": 90000,
  "available": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated motorcycle object */ }
}
```

### **DELETE /api/motorcycles/[id]**
**Admin only** - Deletes motorcycle

**Headers:**
```
Authorization: Bearer <admin_token or auth_token>
```

**Response:**
```json
{
  "success": true
}
```

---

## 🎨 Frontend Components

### **1. Types (`src/types/motorcycle.ts`)**

```typescript
export interface Motorcycle {
  id: string;
  system_code: string;
  title: string;
  description: string;
  price: number;
  daily_price?: number;
  weekly_price?: number;
  monthly_price?: number;
  location: string;
  type: 'scooter' | 'motorcycle' | 'car';
  brand?: string;
  model?: string;
  year?: number;
  cc?: number;
  fuel_type?: string;
  transmission?: 'automatic' | 'manual';
  images: string[];
  features?: string[];
  available: boolean;
  featured?: boolean;
  deposit_required?: number;
  insurance_included?: boolean;
  helmet_included?: boolean;
  min_rental_days?: number;
  max_rental_days?: number;
  user_id?: string;
  contact_whatsapp?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MotorcycleFilters {
  type?: 'scooter' | 'motorcycle' | 'car';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  transmission?: 'automatic' | 'manual';
}
```

### **2. Hook (`src/hooks/useMotorcycles.ts`)**

```typescript
import { useState, useEffect } from 'react';
import { Motorcycle, MotorcycleFilters } from '@/types/motorcycle';

interface UseMotorcyclesParams extends MotorcycleFilters {
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export function useMotorcycles(params?: UseMotorcyclesParams) {
  // Returns: { data, isLoading, error, refetch }
  // Fetches from: /api/motorcycles
}
```

**Usage:**
```typescript
// Public page - only available motorcycles
const { data: motorcycles } = useMotorcycles({
  available: true,
  sortBy: 'newest',
});

// Admin panel - all motorcycles
const { data: motorcycles } = useMotorcycles({
  available: undefined, // Shows all
  sortBy: 'newest',
});
```

### **3. Pages**

#### **`src/app/rent-motorbike/page.tsx`**
- Public motorcycle listing page
- Uses `useMotorcycles({ available: true })`
- Filters: Search, Type, Location, Price
- Displays motorcycles in grid layout
- Links to `/motorcycles/[id]` for details

#### **`src/app/(main)/motorcycles/[id]/page.tsx`**
- Motorcycle detail page
- Fetches from `/api/motorcycles/[id]`
- Shows all motorcycle details
- Displays similar motorcycles
- WhatsApp contact button

#### **`src/app/admin/page.tsx` - Motorcycles Tab**
- Admin management interface
- CRUD operations:
  - ✅ Add New Motorcycle (button)
  - ✅ Edit Motorcycle (Edit button)
  - ✅ Delete Motorcycle (Delete button)
  - ✅ Toggle Available/Unavailable (Eye/EyeOff button)
  - ✅ View Motorcycle (Eye button - opens detail page)
- Filters: Search, Type, Location
- Edit/Add Modal with all fields

### **4. Admin Panel Features**

**Edit Modal Fields:**
- System Code *
- Title *
- Description
- Type * (Scooter/Motorcycle/Car)
- Location *
- Price *
- Daily/Weekly/Monthly Price
- Brand, Model, Year
- CC, Transmission, Fuel Type
- Images (ImageUpload component)
- Features (comma-separated)
- Deposit Required
- Contact WhatsApp
- Min/Max Rental Days
- Checkboxes: Available, Featured, Insurance Included, Helmet Included

---

## 🔄 Data Flow

### **Public Pages (Rent Motorbike)**
```
User visits /rent-motorbike
  ↓
Page component uses useMotorcycles({ available: true })
  ↓
Hook calls /api/motorcycles?available=true&sortBy=newest
  ↓
API route uses supabaseAdmin.from('motorcycles').select('*').eq('available', true)
  ↓
Returns only available motorcycles
  ↓
Page displays motorcycles in grid
```

### **Admin Panel**
```
Admin opens Motorcycles tab
  ↓
Page uses useMotorcycles({ available: undefined })
  ↓
Hook calls /api/motorcycles?sortBy=newest (no available filter)
  ↓
API route uses supabaseAdmin.from('motorcycles').select('*') (no filter)
  ↓
Returns ALL motorcycles (available + unavailable)
  ↓
Admin can edit/delete/toggle availability
```

### **Image Upload Flow**
```
Admin selects images in modal
  ↓
ImageUpload component sends to /api/properties/images
  ↓
API uploads to Supabase Storage (property-images bucket)
  ↓
Returns public URLs
  ↓
URLs added to motorcycle.images array
  ↓
Saved with motorcycle data
```

---

## 📊 Properties vs Motorcycles Separation

### **Properties Table**
- Contains: Villas, Apartments, Houses, Land
- **EXCLUDES**: Motorcycles (moved to separate table)
- API: `/api/properties`
- Hook: `useProperties()`

### **Motorcycles Table**
- Contains: Scooters, Motorcycles, Cars
- **SEPARATE** from properties
- API: `/api/motorcycles`
- Hook: `useMotorcycles()`

### **Filtering Logic**

**Buy Page (`/buy`):**
- Uses `useProperties({ listingType: 'sale' })`
- Client-side filters out: `p.category !== 'motorcycle'`

**Rent Page (`/rent`):**
- Uses `useProperties({ listingType: 'rent' })`
- Client-side filters out: `p.category !== 'motorcycle'`

**Rent Motorbike Page (`/rent-motorbike`):**
- Uses `useMotorcycles({ available: true })`
- Fetches ONLY from motorcycles table

---

## ✅ Migration Checklist

### **1. Database Setup**
- [ ] Run `create_motorcycles_table.sql` migration
- [ ] Verify table created: `SELECT * FROM motorcycles LIMIT 1;`
- [ ] Verify indexes created: `\d motorcycles` (in psql)
- [ ] Verify RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'motorcycles';`
- [ ] Enable RLS: `ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;`

### **2. Data Migration**
- [ ] Check existing motorcycles in properties table:
  ```sql
  SELECT * FROM properties WHERE category = 'motorcycle';
  ```
- [ ] Migrate data to motorcycles table (if needed):
  ```sql
  INSERT INTO motorcycles (
    system_code, title, description, price, location, type,
    images, available, created_at
  )
  SELECT 
    system_code, title, description, price, 
    COALESCE(location, 'Canggu'), 
    CASE 
      WHEN category = 'motorcycle' THEN 'motorcycle'
      WHEN category = 'scooter' THEN 'scooter'
      ELSE 'scooter'
    END,
    images, available, created_at
  FROM properties
  WHERE category IN ('motorcycle', 'scooter');
  ```
- [ ] Verify migration:
  ```sql
  SELECT COUNT(*) FROM motorcycles;
  ```
- [ ] Delete from properties (if migrated):
  ```sql
  DELETE FROM properties WHERE category IN ('motorcycle', 'scooter');
  ```

### **3. API Routes**
- [ ] Verify `/api/motorcycles/route.ts` exists
- [ ] Verify `/api/motorcycles/[id]/route.ts` exists
- [ ] Test GET: `curl https://your-domain.com/api/motorcycles`
- [ ] Test GET with filter: `curl https://your-domain.com/api/motorcycles?available=true`
- [ ] Test POST (with auth token): Create new motorcycle
- [ ] Test PUT (with auth token): Update motorcycle
- [ ] Test DELETE (with auth token): Delete motorcycle

### **4. Frontend Files**
- [ ] Verify `src/types/motorcycle.ts` exists
- [ ] Verify `src/hooks/useMotorcycles.ts` exists
- [ ] Verify `src/app/rent-motorbike/page.tsx` exists
- [ ] Verify `src/app/(main)/motorcycles/[id]/page.tsx` exists
- [ ] Verify admin panel has Motorcycles tab

### **5. Environment Variables**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (for API routes)

### **6. Supabase Storage**
- [ ] `property-images` bucket exists
- [ ] Storage policies allow authenticated uploads
- [ ] Test image upload in admin panel

### **7. Testing**
- [ ] Visit `/rent-motorbike` - motorcycles should display
- [ ] Visit `/motorcycles/[id]` - detail page should work
- [ ] Admin panel: Motorcycles tab shows all motorcycles
- [ ] Admin panel: Can add new motorcycle
- [ ] Admin panel: Can edit motorcycle
- [ ] Admin panel: Can delete motorcycle
- [ ] Admin panel: Can toggle available/unavailable
- [ ] Verify motorcycles NOT showing on `/buy` page
- [ ] Verify motorcycles NOT showing on `/rent` page

---

## 🔧 Troubleshooting

### **Problem: Motorcycles not showing on /rent-motorbike**

**Check:**
1. Database has motorcycles:
   ```sql
   SELECT COUNT(*) FROM motorcycles WHERE available = true;
   ```
2. API endpoint works:
   ```bash
   curl https://your-domain.com/api/motorcycles?available=true
   ```
3. Browser console logs:
   - Check for `[useMotorcycles]` logs
   - Check for API errors
4. Network tab:
   - Verify `/api/motorcycles?available=true&sortBy=newest` request
   - Check response status and data

**Fix:**
- Verify `available` parameter is passed: `useMotorcycles({ available: true })`
- Check API route uses `supabaseAdmin` (not regular supabase client)
- Verify RLS policies allow public SELECT on available motorcycles

### **Problem: Admin panel shows no motorcycles**

**Check:**
1. Hook parameters:
   ```typescript
   useMotorcycles({ available: undefined }) // Shows all
   ```
2. API response:
   ```bash
   curl https://your-domain.com/api/motorcycles
   # Should return all motorcycles (no available filter)
   ```
3. Console logs:
   - Check `[useMotorcycles]` logs in browser console

**Fix:**
- Ensure `available: undefined` is passed (not `available: true`)
- Verify API route doesn't filter when `available` param is missing

### **Problem: Can't edit/delete motorcycles in admin**

**Check:**
1. Authentication token:
   ```javascript
   localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
   ```
2. API response errors:
   - Check Network tab for 401/403 errors
   - Check console for error messages
3. RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'motorcycles';
   ```

**Fix:**
- Verify admin is logged in
- Check token is sent in Authorization header
- Verify RLS policies allow admin UPDATE/DELETE

### **Problem: Images not uploading**

**Check:**
1. Storage bucket exists:
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'property-images';
   ```
2. Storage policies:
   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'property-images';
   ```
3. API route `/api/properties/images` works

**Fix:**
- Create bucket if missing
- Add storage policies for authenticated uploads
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set

---

## 🚀 Deployment Checklist

### **Before Deploy**
- [ ] All TypeScript errors fixed
- [ ] All linter errors fixed
- [ ] Database migrations applied
- [ ] API routes tested locally
- [ ] Frontend components tested locally

### **Vercel Environment Variables**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET`
- [ ] `SENDGRID_API_KEY` (or `RESEND_API_KEY`)
- [ ] `FROM_EMAIL`

### **After Deploy**
- [ ] Visit `/rent-motorbike` - verify motorcycles display
- [ ] Visit `/motorcycles/[id]` - verify detail page works
- [ ] Login to admin panel
- [ ] Open Motorcycles tab - verify list displays
- [ ] Test Add New Motorcycle
- [ ] Test Edit Motorcycle
- [ ] Test Delete Motorcycle
- [ ] Test Toggle Available
- [ ] Test Image Upload
- [ ] Verify `/buy` page excludes motorcycles
- [ ] Verify `/rent` page excludes motorcycles

---

## 📝 File Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── motorcycles/
│   │       └── [id]/
│   │           └── page.tsx          # Motorcycle detail page
│   ├── admin/
│   │   └── page.tsx                  # Admin dashboard (Motorcycles tab)
│   └── api/
│       └── motorcycles/
│           ├── route.ts              # GET, POST /api/motorcycles
│           └── [id]/
│               └── route.ts          # GET, PUT, DELETE /api/motorcycles/[id]
├── components/
│   ├── ImageUpload.tsx               # Image upload component (used in admin)
│   └── ...
├── hooks/
│   └── useMotorcycles.ts             # Motorcycle data fetching hook
├── types/
│   └── motorcycle.ts                 # Motorcycle TypeScript types
└── lib/
    ├── supabase.ts                   # Client-side Supabase client
    └── supabaseAdmin.ts              # Server-side Supabase admin client

supabase/
└── migrations/
    └── create_motorcycles_table.sql  # Database schema migration
```

---

## 🔑 Key Points

1. **Separation:** Motorcycles are in a separate table, NOT in properties table
2. **API:** All motorcycle operations use `/api/motorcycles` endpoints
3. **Hook:** Use `useMotorcycles()` hook, NOT `useProperties()` for motorcycles
4. **RLS:** Public can only see `available = true` motorcycles
5. **Admin:** Admin panel uses `available: undefined` to see all motorcycles
6. **Images:** Motorcycle images use same bucket as properties (`property-images`)
7. **Filtering:** Buy/Rent pages exclude motorcycles client-side (they're in separate table anyway)

---

## 🧪 Testing Commands

### **Database**
```sql
-- Check motorcycles count
SELECT COUNT(*) FROM motorcycles;

-- Check available motorcycles
SELECT COUNT(*) FROM motorcycles WHERE available = true;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'motorcycles';

-- Test public query (should only return available)
SELECT * FROM motorcycles; -- As public user (should only show available=true)

-- Test admin query (should return all)
-- (Use service role key in API route)
```

### **API Testing**
```bash
# Get all motorcycles (public - only available)
curl https://your-domain.com/api/motorcycles?available=true

# Get all motorcycles (admin - all)
curl https://your-domain.com/api/motorcycles \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get single motorcycle
curl https://your-domain.com/api/motorcycles/MOTORCYCLE_ID

# Create motorcycle
curl -X POST https://your-domain.com/api/motorcycles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "system_code": "MC999",
    "title": "Test Motorcycle",
    "price": 100000,
    "location": "Canggu",
    "type": "scooter",
    "available": true
  }'
```

---

## ✅ Verification Steps

1. **Database:**
   ```sql
   SELECT id, system_code, title, type, available FROM motorcycles LIMIT 5;
   ```

2. **API:**
   - Open browser console
   - Visit `/rent-motorbike`
   - Check console logs: `[useMotorcycles] Fetched from API: X motorcycles`
   - Check Network tab: `/api/motorcycles?available=true&sortBy=newest`

3. **Admin Panel:**
   - Login as admin
   - Click "Motorcycles" tab
   - Should see all motorcycles (available + unavailable)
   - Click "Add New Motorcycle" - modal should open
   - Click Edit on any motorcycle - modal should open with data

4. **Public Pages:**
   - Visit `/rent-motorbike` - should show available motorcycles
   - Visit `/buy` - should NOT show motorcycles
   - Visit `/rent` - should NOT show motorcycles

---

Bu dokümantasyonu kullanarak tüm değişiklikleri uygulamanıza entegre edebilirsiniz. Herhangi bir sorun olursa Troubleshooting bölümüne bakın.


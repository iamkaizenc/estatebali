# 📘 Estate Bali - Complete Application Specification

**Version:** 1.0  
**Last Updated:** December 2024  
**Framework:** Next.js 14.2.3 (App Router)  
**Database:** Supabase (PostgreSQL)  
**Deployment:** Vercel

---

## 📑 İçindekiler

1. [Domain & Routing Structure](#1-domain--routing-structure)
2. [Database Schemas](#2-database-schemas)
3. [API Endpoints](#3-api-endpoints)
4. [Frontend Pages & Routes](#4-frontend-pages--routes)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Middleware & Redirects](#6-middleware--redirects)
7. [Environment Variables](#7-environment-variables)
8. [Features & Functionality](#8-features--functionality)
9. [File Structure](#9-file-structure)

---

## 1. Domain & Routing Structure

### **Base Domain**
- **Production:** `https://estatebali.app`
- **Development:** `http://localhost:3000`

### **Public Routes (No Authentication Required)**

```
/                           → Homepage (Hero, Featured Properties, Search)
/buy                        → Properties for Sale Listing
/rent                       → Properties for Rent Listing
/rent-motorbike             → Motorcycles for Rent Listing
/map                        → Interactive Map Search
/properties                 → All Properties Listing
/featured                   → Featured Properties Listing
/area/[area]                → Area-based Property Listing (Seminyak, Canggu, Ubud, etc.)
/property/[id]              → Property Detail Page
/motorcycles/[id]           → Motorcycle Detail Page
/about                      → About Us Page
/agents                     → Real Estate Agents Listing
/services                   → Services Page (Visa, Residency, Company Setup, etc.)
/login                      → User/Admin Login Page
/register                   → User Registration Page
/forgot-password            → Password Reset Request Page
/reset-password             → Password Reset Page (with token)
/privacy                    → Privacy Policy
/terms                      → Terms of Service
/sitemap                    → Sitemap Page
```

### **Protected User Routes (Authentication Required)**

```
/user                       → User Dashboard
/user/profile               → User Profile Management
/user/favorites             → User's Favorite Properties
/user/messages              → User Messages/Conversations
/user/notifications         → User Notifications
/user/bookings              → User Bookings
/user/saved-searches        → Saved Search Queries
/user/settings              → User Settings
/create                     → Create New Property Listing
/property/[id]/edit         → Edit Own Property
```

### **Protected Admin Routes (Admin Authentication Required)**

```
/admin                      → Admin Dashboard (Properties, Users, Images, Motorcycles)
/admin/approvals            → Property Approval Management
/admin/leads                → Investment Leads Management
/admin/login                → Admin Login (alternative)
```

### **API Routes**

```
/api/auth/login             → POST - User/Admin Login
/api/auth/register          → POST - User Registration
/api/auth/forgot-password   → POST - Request Password Reset
/api/auth/reset-password    → POST - Reset Password

/api/properties             → GET, POST - List/Create Properties
/api/properties/[id]        → GET, PUT, DELETE - Property CRUD
/api/properties/[id]/increment-view → POST - Increment View Count
/api/properties/images      → POST, DELETE - Image Upload/Delete

/api/motorcycles            → GET, POST - List/Create Motorcycles
/api/motorcycles/[id]       → GET, PUT, DELETE - Motorcycle CRUD

/api/favorites              → GET, POST - User Favorites
/api/favorites/[id]         → DELETE - Remove Favorite
/api/favorites/property/[propertyId] → POST, DELETE - Toggle Favorite

/api/users                  → GET, PUT - User Management (Admin)
/api/users/profile          → GET, PUT - User Profile

/api/investment-leads       → GET, POST - Investment Leads
/api/investment-leads/[id]  → GET, PUT, DELETE - Lead Management

/api/bookings               → GET, POST - Property Bookings
/api/notifications          → GET, PUT - User Notifications
/api/notifications/[id]     → PUT - Mark Notification Read

/api/saved-searches         → GET, POST, DELETE - Saved Searches

/api/health                 → GET - Health Check
/api/test-env               → GET - Environment Test
```

---

## 2. Database Schemas

### **2.1 Users Table** (`public.users`)

**Purpose:** Regular users (customers, owners, agents)

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  avatar text,
  agency_name text,
  website text,
  password_hash varchar,
  role text DEFAULT 'customer' CHECK (role IN ('owner', 'agent', 'customer')),
  verified boolean DEFAULT false,
  whatsapp varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `email` (UNIQUE)
- `role`

**RLS Policies:**
- Public can view basic user info (name, avatar, agency_name)
- Users can view/update own profile
- Admins can view/update all users

---

### **2.2 Admin Users Table** (`public.admin_users`)

**Purpose:** Admin users (separate from regular users)

```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  name varchar NOT NULL,
  role varchar DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `email` (UNIQUE)

**RLS Policies:**
- Only admins can view/update admin_users

---

### **2.3 Properties Table** (`public.properties`)

**Purpose:** Real estate properties (villas, apartments, houses, land)

```sql
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text UNIQUE,
  system_code text,
  title text NOT NULL,
  type text CHECK (type IN ('sale', 'rent')),
  category text CHECK (category IN ('villa', 'apartment', 'house', 'land', 'motorcycle', 'motorbike', 'scooter', 'car', 'suv')),
  price bigint NOT NULL,
  price_per_month bigint,
  price_per_day bigint,
  short_term_rental boolean DEFAULT false,
  price_per_sqm bigint,
  
  -- Location
  location text NOT NULL,
  area text NOT NULL,
  latitude numeric,
  longitude numeric,
  coordinates jsonb,
  
  -- Property Details
  description text,
  bedrooms integer,
  bathrooms integer,
  wc integer,
  kitchens integer,
  living_rooms integer,
  size integer NOT NULL, -- m²
  plot_size integer,
  levels integer,
  floors integer,
  year_built integer,
  
  -- Features (Boolean)
  new_development boolean DEFAULT false,
  furnished boolean DEFAULT false,
  has_parking boolean DEFAULT false,
  has_terrace boolean DEFAULT false,
  has_view boolean DEFAULT false,
  has_garden boolean DEFAULT false,
  has_pool boolean DEFAULT false,
  is_penthouse boolean DEFAULT false,
  has_air_conditioning boolean DEFAULT false,
  has_warehouse boolean DEFAULT false,
  has_security_door boolean DEFAULT false,
  has_alarm boolean DEFAULT false,
  has_fireplace boolean DEFAULT false,
  has_elevator boolean DEFAULT false,
  has_solar_water_heater boolean DEFAULT false,
  wheelchair_accessible boolean DEFAULT false,
  suitable_for_students boolean DEFAULT false,
  
  -- Energy & Heating
  energy_class text CHECK (energy_class IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
  heating_type text CHECK (heating_type IN ('autonomous', 'central', 'none')),
  heating_medium text CHECK (heating_medium IN ('oil', 'gas', 'electric', 'solar', 'none')),
  
  -- Media
  images text[] DEFAULT ARRAY[]::text[],
  videos text[] DEFAULT ARRAY[]::text[],
  virtual_tour text,
  has_photos boolean DEFAULT false,
  
  -- Additional Info
  amenities text[] DEFAULT ARRAY[]::text[],
  features jsonb DEFAULT '{}'::jsonb,
  listing_source text CHECK (listing_source IN ('owner', 'agent', 'manual')),
  owner_id uuid REFERENCES users(id),
  user_id uuid REFERENCES users(id),
  contact_whatsapp varchar,
  
  -- Investment Data
  estimated_annual_income bigint,
  estimated_net_yield numeric,
  occupancy_rate integer CHECK (occupancy_rate >= 0 AND occupancy_rate <= 100),
  target_tenant text CHECK (target_tenant IN ('tourists', 'digital nomads', 'long-term expats')),
  average_monthly_expenses bigint,
  distance_from_sea text,
  available_from text,
  
  -- Leasehold
  leasehold_years integer CHECK (leasehold_years > 0),
  leasehold_extendable boolean DEFAULT false,
  
  -- Status
  listing_type varchar DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
  featured boolean DEFAULT false,
  verified boolean DEFAULT false,
  available boolean DEFAULT true,
  price_reduced boolean DEFAULT false,
  show_on_rent_motorbike boolean DEFAULT false,
  
  -- Analytics
  views integer DEFAULT 0,
  favorites integer DEFAULT 0,
  
  -- Short-term Booking
  short_term_booking jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `listing_id` (UNIQUE)
- `category`
- `type`
- `location`
- `price`
- `featured`
- `available`
- `user_id`
- `owner_id`

**RLS Policies:**
- Public can view available properties
- Users can view/update own properties
- Admins have full access

---

### **2.4 Motorcycles Table** (`public.motorcycles`)

**Purpose:** Motorcycle/vehicle rentals (separate from properties)

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

**Indexes:**
- `system_code` (UNIQUE)
- `type`
- `location`
- `available`
- `price`

**RLS Policies:**
- Public can view available motorcycles
- Authenticated users can create motorcycles
- Users can update/delete own motorcycles
- Admins have full access

---

### **2.5 Favorites Table** (`public.favorites`)

**Purpose:** User favorite properties

```sql
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  property_id uuid NOT NULL REFERENCES properties(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);
```

**Indexes:**
- `user_id`
- `property_id`
- `(user_id, property_id)` (UNIQUE)

**RLS Policies:**
- Users can view/insert/delete own favorites

---

### **2.6 Conversations Table** (`public.conversations`)

**Purpose:** User conversations about properties

```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  property_title text NOT NULL,
  property_image text,
  customer_id uuid NOT NULL,
  customer_name text NOT NULL,
  owner_id uuid NOT NULL,
  owner_name text NOT NULL,
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view conversations they're part of

---

### **2.7 Messages Table** (`public.messages`)

**Purpose:** Individual messages in conversations

```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES properties(id),
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view messages in their conversations
- Users can send messages in their conversations

---

### **2.8 Notifications Table** (`public.notifications`)

**Purpose:** User notifications

```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN (
    'message', 'property_new', 'property_update', 'property_price_drop',
    'favorite_match', 'saved_search_match', 'booking_request',
    'booking_confirmed', 'booking_cancelled', 'system'
  )),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  image text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view/update own notifications

---

### **2.9 Bookings Table** (`public.bookings`)

**Purpose:** Property rental bookings

```sql
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  customer_id uuid NOT NULL,
  owner_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price bigint NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  guest_count integer DEFAULT 1,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view bookings they're part of (customer or owner)

---

### **2.10 Investment Leads Table** (`public.investment_leads`)

**Purpose:** Investment inquiry leads from property detail pages

```sql
CREATE TABLE investment_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text,
  phone_alt text,
  budget text,
  budget_range text,
  investment_goal text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes text,
  source text DEFAULT 'property_detail_form',
  user_id uuid REFERENCES users(id),
  ip_address text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Admins can view all leads
- Users can view own leads

---

### **2.11 Saved Searches Table** (`public.saved_searches`)

**Purpose:** User saved search queries

```sql
CREATE TABLE saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  location text NOT NULL,
  type text CHECK (type IN ('sale', 'rent', 'all')),
  created_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view/delete own saved searches

---

### **2.12 Password Reset Tokens Table** (`public.password_reset_tokens`)

**Purpose:** Password reset tokens

```sql
CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token varchar UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can create tokens
- Tokens are validated server-side

---

### **2.13 Stripe Deposits Table** (`public.stripe_deposits`)

**Purpose:** Stripe payment tracking for property deposits

```sql
CREATE TABLE stripe_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  user_id uuid REFERENCES users(id),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  amount integer NOT NULL, -- cents
  currency text DEFAULT 'usd',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled')),
  customer_email text,
  customer_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  refunded_at timestamptz,
  refund_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

### **2.14 Profitable Properties Table** (`public.profitable_properties`)

**Purpose:** Investment analysis for properties

```sql
CREATE TABLE profitable_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid UNIQUE REFERENCES properties(id),
  roi numeric NOT NULL CHECK (roi >= 0 AND roi <= 100),
  occupancy_rate numeric NOT NULL CHECK (occupancy_rate >= 0 AND occupancy_rate <= 100),
  verified boolean DEFAULT false,
  monthly_revenue numeric,
  annual_net_yield numeric,
  investment_grade text CHECK (investment_grade IN ('A+', 'A', 'B+', 'B', 'C')),
  last_verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

### **2.15 Notification Preferences Table** (`public.notification_preferences`)

**Purpose:** User notification preferences

```sql
CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY,
  message_notifications boolean DEFAULT true,
  property_notifications boolean DEFAULT true,
  price_drop_notifications boolean DEFAULT true,
  booking_notifications boolean DEFAULT true,
  saved_search_notifications boolean DEFAULT true,
  system_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## 3. API Endpoints

### **3.1 Authentication Endpoints**

#### **POST /api/auth/login**
**Description:** User/Admin login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer" // or "admin"
  }
}
```

**Authentication:** None (public)

---

#### **POST /api/auth/register**
**Description:** User registration

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "phone": "+6281234567890"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

#### **POST /api/auth/forgot-password**
**Description:** Request password reset

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### **POST /api/auth/reset-password**
**Description:** Reset password with token

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### **3.2 Properties Endpoints**

#### **GET /api/properties**
**Description:** List properties with filters

**Query Parameters:**
- `listingType` - `sale` or `rent`
- `type` - Property type (villa, apartment, etc.)
- `location` - Location filter
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `featured` - `true` for featured only
- `sortBy` - `views`, `created_at`, or `price`
- `includeHidden` - `true` for admin (include unavailable)
- `showOnRentMotorbike` - `true` to filter for rent motorbike page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Luxury Villa in Seminyak",
      "price": 8500000000,
      "type": "villa",
      "listingType": "sale",
      "location": { "address": "...", "area": "Seminyak", "city": "Bali" },
      "images": ["https://..."],
      ...
    }
  ]
}
```

**Authentication:** Public (admin can access hidden with token)

---

#### **POST /api/properties**
**Description:** Create new property

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** Full property object

**Response:**
```json
{
  "success": true,
  "data": { /* created property */ }
}
```

**Authentication:** Required (user/admin)

---

#### **GET /api/properties/[id]**
**Description:** Get single property

**Response:**
```json
{
  "success": true,
  "data": { /* property object */ }
}
```

**Authentication:** Public (admin can access hidden with token)

---

#### **PUT /api/properties/[id]**
**Description:** Update property (supports partial updates)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** Partial property object

**Response:**
```json
{
  "success": true,
  "data": { /* updated property */ }
}
```

**Authentication:** Required (owner/admin)

---

#### **DELETE /api/properties/[id]**
**Description:** Delete property

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

**Authentication:** Required (owner/admin)

---

#### **POST /api/properties/images**
**Description:** Upload property images

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData:
  - file: <image file>
  - bucket: "property-images"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://...supabase.co/.../image.jpg"
  }
}
```

---

#### **DELETE /api/properties/images**
**Description:** Delete property image

**Query Parameters:**
- `path` - Image path in storage
- `bucket` - Bucket name

**Request Headers:**
```
Authorization: Bearer <token>
```

---

### **3.3 Motorcycles Endpoints**

#### **GET /api/motorcycles**
**Description:** List motorcycles with filters

**Query Parameters:**
- `type` - `scooter`, `motorcycle`, or `car`
- `location` - Location filter
- `available` - `true` for available only, omit for all (admin)
- `featured` - `true` for featured only
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sortBy` - `newest`, `price-asc`, `price-desc`, `popular`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "system_code": "MC001",
      "title": "Honda Scoopy",
      "price": 80000,
      "type": "scooter",
      ...
    }
  ]
}
```

**Authentication:** Public (shows only available unless admin)

---

#### **POST /api/motorcycles**
**Description:** Create new motorcycle

**Request Headers:**
```
Authorization: Bearer <token>
```

**Authentication:** Required (admin)

---

#### **GET /api/motorcycles/[id]**
**Description:** Get single motorcycle

**Response:**
```json
{
  "success": true,
  "data": { /* motorcycle object */ }
}
```

**Note:** Automatically increments view count

---

#### **PUT /api/motorcycles/[id]**
**Description:** Update motorcycle

**Request Headers:**
```
Authorization: Bearer <token>
```

**Authentication:** Required (owner/admin)

---

#### **DELETE /api/motorcycles/[id]**
**Description:** Delete motorcycle

**Request Headers:**
```
Authorization: Bearer <token>
```

**Authentication:** Required (owner/admin)

---

### **3.4 Favorites Endpoints**

#### **GET /api/favorites**
**Description:** Get user's favorite properties

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "property": { /* full property object */ },
      "created_at": "..."
    }
  ]
}
```

**Authentication:** Required

---

#### **POST /api/favorites**
**Description:** Add property to favorites

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "propertyId": "uuid"
}
```

---

#### **POST /api/favorites/property/[propertyId]**
**Description:** Toggle favorite (add if not exists, remove if exists)

**Request Headers:**
```
Authorization: Bearer <token>
```

---

#### **DELETE /api/favorites/[id]**
**Description:** Remove favorite

**Request Headers:**
```
Authorization: Bearer <token>
```

---

### **3.5 Users Endpoints**

#### **GET /api/users**
**Description:** Get users (admin only)

**Query Parameters:**
- `all` - `true` to get all users

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "customer",
      ...
    }
  ]
}
```

---

#### **PUT /api/users**
**Description:** Update user (admin or own profile)

**Query Parameters:**
- `id` - User ID (for admin)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Name",
  "role": "agent" // admin only
}
```

---

#### **GET /api/users/profile**
**Description:** Get current user profile

**Request Headers:**
```
Authorization: Bearer <token>
```

---

#### **PUT /api/users/profile**
**Description:** Update current user profile

**Request Headers:**
```
Authorization: Bearer <token>
```

---

### **3.6 Investment Leads Endpoints**

#### **GET /api/investment-leads**
**Description:** Get investment leads (admin only)

**Query Parameters:**
- `status` - Filter by status (`new`, `contacted`, etc.)

**Request Headers:**
```
Authorization: Bearer <admin_token>
```

---

#### **POST /api/investment-leads**
**Description:** Create investment lead (from property detail page)

**Request Body:**
```json
{
  "propertyId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+6281234567890",
  "budget": "1-2 Billion",
  "investmentGoal": "Rental Income"
}
```

**Authentication:** Public (creates lead)

---

#### **PATCH /api/investment-leads/[id]**
**Description:** Update lead status (admin only)

**Request Body:**
```json
{
  "status": "contacted"
}
```

---

### **3.7 Other Endpoints**

#### **GET /api/bookings**
**Description:** Get user bookings

**Request Headers:**
```
Authorization: Bearer <token>
```

---

#### **GET /api/notifications**
**Description:** Get user notifications

**Request Headers:**
```
Authorization: Bearer <token>
```

---

#### **GET /api/saved-searches**
**Description:** Get user saved searches

**Request Headers:**
```
Authorization: Bearer <token>
```

---

## 4. Frontend Pages & Routes

### **4.1 Public Pages**

#### **Homepage** (`/`)
- Hero section with search
- Featured properties carousel
- Most popular properties (by views)
- Categories (Buy, Rent, Rent Motorbike)
- Location-based quick links
- Statistics

**Components Used:**
- `Header`
- `SearchBar`
- `PropertyCard`
- `Footer`

---

#### **Buy Properties** (`/buy`)
- Property listing for sale
- Filters: Type, Location, Price Range, Features
- Search bar
- Sort options
- Pagination (if implemented)
- Grid/List view toggle

**Data Source:**
- Uses `useProperties({ listingType: 'sale', excludeTypes: ['motorbike', 'scooter'] })`

---

#### **Rent Properties** (`/rent`)
- Property listing for rent
- Same filters as Buy page
- Short-term rental toggle

**Data Source:**
- Uses `useProperties({ listingType: 'rent', excludeTypes: ['motorbike', 'scooter'] })`

---

#### **Rent Motorbike** (`/rent-motorbike`)
- Motorcycle listing
- Filters: Type (Scooter/Motorcycle/Car), Location, Price
- "Coming Soon" banner with WhatsApp CTA
- Stats cards
- Grid layout

**Data Source:**
- Uses `useMotorcycles({ available: true, sortBy: 'newest' })`

---

#### **Map Search** (`/map`)
- Interactive Leaflet map
- Property markers
- Filter panel
- Click marker to view property details
- Search by location

**Data Source:**
- Uses `useProperties()` with coordinates

---

#### **Property Detail** (`/property/[id]`)
- Full property information
- Image gallery
- Google Maps integration
- Contact buttons (WhatsApp, Phone)
- Investment lead form
- Similar properties
- Share buttons
- Favorite button (if authenticated)

**Data Source:**
- Uses `useProperty(id)` hook
- Fetches from `/api/properties/[id]`

---

#### **Motorcycle Detail** (`/motorcycles/[id]`)
- Full motorcycle information
- Image gallery
- Specifications (Brand, Model, Year, CC, Transmission)
- Price (Daily/Weekly/Monthly)
- Features list
- Included items (Insurance, Helmet)
- Contact buttons
- Similar motorcycles

**Data Source:**
- Fetches from `/api/motorcycles/[id]`

---

#### **About** (`/about`)
- Company information
- Mission/Vision
- Team section
- Statistics

---

#### **Agents** (`/agents`)
- Real estate agents listing
- Agent cards with contact info
- Filter by location/specialty

---

#### **Services** (`/services`)
- Services offered:
  - Visa Services
  - Residency Services
  - Company Setup
  - Legal Services
  - Relocation Services
- "Coming Soon" notices
- WhatsApp CTAs
- "How it works" section
- Contact information

---

#### **Login** (`/login`)
- Single login form for users and admins
- Email/Password fields
- Remember me option
- Forgot password link
- Register link
- Auto-redirect based on role after login:
  - Admin → `/admin`
  - User → `/user`

---

#### **Register** (`/register`)
- Registration form
- Email, Password, Name, Phone
- Terms acceptance
- Redirects to login after success

---

### **4.2 Protected User Pages**

#### **User Dashboard** (`/user`)
- Overview stats
- Recent activity
- Quick actions
- Property management (own properties)

**Authentication:** Required (user role)

---

#### **User Profile** (`/user/profile`)
- Edit profile information
- Change password
- Upload avatar
- Update contact info

---

#### **Favorites** (`/user/favorites`)
- List of favorite properties
- Remove from favorites
- Quick view/contact

**Data Source:**
- Uses `/api/favorites`

---

#### **Messages** (`/user/messages`)
- Conversation list
- Message threads
- Real-time updates (if implemented)

**Data Source:**
- Uses `/api/conversations` and `/api/messages`

---

#### **Bookings** (`/user/bookings`)
- Booking history
- Upcoming bookings
- Booking status
- Cancel booking

**Data Source:**
- Uses `/api/bookings`

---

#### **Create Listing** (`/create`)
- Property creation form
- Image upload
- Location picker
- Feature selection
- Preview before submit

**Authentication:** Required

**Submission:**
- POST to `/api/properties`

---

#### **Edit Property** (`/property/[id]/edit`)
- Edit existing property
- Same form as Create
- Pre-filled with existing data
- Update images

**Authentication:** Required (owner or admin)

---

### **4.3 Protected Admin Pages**

#### **Admin Dashboard** (`/admin`)
- 4 Tabs:
  1. **Properties** - Manage all properties
  2. **Users** - Manage users
  3. **Images** - Image management
  4. **Motorcycles** - Manage motorcycles

**Features:**
- Add/Edit/Delete operations
- Filters and search
- Bulk actions
- Statistics cards
- Modals for editing

**Authentication:** Required (admin role)

---

#### **Admin Approvals** (`/admin/approvals`)
- Pending property approvals
- Approve/Reject actions
- Filter by status

---

#### **Admin Leads** (`/admin/leads`)
- Investment leads management
- Lead status updates
- Contact information
- Notes

---

## 5. Authentication & Authorization

### **5.1 Authentication Flow**

1. **User Login:**
   ```
   POST /api/auth/login
   → Verify email/password
   → Check users table OR admin_users table
   → Generate JWT token
   → Return token + user info
   → Store token in localStorage (admin_token or auth_token)
   → Redirect based on role:
      - admin → /admin
      - user → /user
   ```

2. **Token Storage:**
   - Admin: `localStorage.setItem('admin_token', token)`
   - User: `localStorage.setItem('auth_token', token)`

3. **Token Verification:**
   - API routes check `Authorization: Bearer <token>` header
   - Decode JWT to get user ID and role
   - Verify token signature and expiration

### **5.2 Role-Based Access**

**Roles:**
- `customer` - Regular user
- `owner` - Property owner
- `agent` - Real estate agent
- `admin` - Admin user (from admin_users table)
- `super_admin` - Super admin

**Access Levels:**

| Route | Public | Customer | Owner | Agent | Admin |
|-------|--------|----------|-------|-------|-------|
| `/`, `/buy`, `/rent` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/property/[id]` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/user` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/create` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/property/[id]/edit` | ❌ | ❌ | ✅* | ✅* | ✅ |
| `/admin` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/api/properties` (GET) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/properties` (POST) | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/api/properties/[id]` (PUT) | ❌ | ❌ | ✅* | ✅* | ✅ |
| `/api/users` (all) | ❌ | ❌ | ❌ | ❌ | ✅ |

*Only if user owns the property

---

## 6. Middleware & Redirects

### **6.1 Middleware** (`src/middleware.ts`)

**Purpose:** Route protection and authentication

**Protected Routes:**
- `/admin/*` - Requires admin role
- `/user/*` - Requires authentication
- `/create` - Requires authentication
- `/property/[id]/edit` - Requires owner/admin

**Redirect Logic:**
- Unauthenticated user → `/login`
- Authenticated user → Based on role
- Admin trying to access user routes → `/admin`
- User trying to access admin routes → `/user`

**Token Verification:**
- Checks `Authorization` header
- Validates JWT signature
- Checks expiration
- Extracts user role

---

### **6.2 Route Protection Components**

#### **ProtectedRoute Component**
```typescript
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

#### **ProtectedAdminRoute Component**
```typescript
<ProtectedAdminRoute>
  <AdminPanel />
</ProtectedAdminRoute>
```

---

## 7. Environment Variables

### **Required Environment Variables**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# JWT Authentication
JWT_SECRET=your_32_character_secret_key_here

# Email Service (SendGrid or Resend)
SENDGRID_API_KEY=SG.xxx...
# OR
RESEND_API_KEY=re_xxx...

FROM_EMAIL=noreply@estatebali.app

# Optional
NEXT_PUBLIC_APP_URL=https://estatebali.app
```

### **Environment Validation**

The app validates environment variables on startup:
- Missing required vars → App fails to start
- Invalid format → Warning logs

---

## 8. Features & Functionality

### **8.1 Property Features**

✅ **Property Types:**
- Villa
- Apartment
- House
- Land
- (Motorcycles moved to separate table)

✅ **Listing Types:**
- For Sale
- For Rent
- Short-term Rental

✅ **Filters:**
- Location (Area, City)
- Property Type
- Price Range
- Bedrooms/Bathrooms
- Features (Pool, Parking, etc.)
- Investment Criteria (ROI, Yield)

✅ **Sorting:**
- Most Popular (by views)
- Newest
- Price (Low to High, High to Low)

✅ **Property Details:**
- Image gallery
- Virtual tour
- Map location
- Investment analysis
- Contact options
- Share functionality

---

### **8.2 Motorcycle Features**

✅ **Types:**
- Scooter
- Motorcycle
- Car

✅ **Pricing:**
- Daily rate
- Weekly rate
- Monthly rate

✅ **Details:**
- Brand, Model, Year
- Engine (CC)
- Transmission (Automatic/Manual)
- Fuel Type
- Features (GPS, Bluetooth, etc.)
- Included items (Insurance, Helmet)
- Deposit required
- Min/Max rental days

---

### **8.3 User Features**

✅ **Account Management:**
- Registration
- Login/Logout
- Password reset
- Profile editing
- Avatar upload

✅ **Property Management:**
- Create listing
- Edit own properties
- Delete own properties
- View analytics (views, favorites)

✅ **Interactions:**
- Add to favorites
- Save searches
- Send messages to property owners
- Book properties
- Investment lead submission

✅ **Notifications:**
- New messages
- Property updates
- Price drops
- Booking confirmations
- Saved search matches

---

### **8.4 Admin Features**

✅ **Dashboard:**
- Overview statistics
- Recent activity
- Quick actions

✅ **Property Management:**
- View all properties
- Edit any property
- Delete properties
- Approve/reject listings
- Toggle featured/verified status
- Manage visibility (available/unavailable)
- Bulk operations

✅ **User Management:**
- View all users
- Edit user roles
- Activate/deactivate users
- View user activity

✅ **Motorcycle Management:**
- Full CRUD operations
- Image management
- Availability toggle
- Featured toggle

✅ **Leads Management:**
- View investment leads
- Update lead status
- Add notes
- Export data

✅ **Analytics:**
- Property views
- User registrations
- Lead conversions
- Popular locations

---

### **8.5 Search & Discovery**

✅ **Search Features:**
- Full-text search (title, description)
- Advanced filters
- Map-based search
- Area-based browsing
- Saved searches
- Search history

✅ **Recommendations:**
- Featured properties
- Similar properties
- Popular in area
- Recently viewed

---

### **8.6 Communication**

✅ **Messaging:**
- Property-based conversations
- Real-time notifications
- Unread counts
- Message history

✅ **Contact Methods:**
- WhatsApp integration
- Phone calls
- Email (via forms)
- In-app messaging

---

## 9. File Structure

```
estatebali/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (main)/                   # Main layout group
│   │   │   └── motorcycles/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── [locale]/                 # i18n routes
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── about/
│   │   ├── admin/
│   │   │   ├── approvals/
│   │   │   ├── leads/
│   │   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── agents/
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   ├── properties/
│   │   │   ├── motorcycles/
│   │   │   ├── favorites/
│   │   │   ├── users/
│   │   │   └── ...
│   │   ├── area/
│   │   ├── buy/
│   │   ├── create/
│   │   ├── login/
│   │   ├── map/
│   │   ├── property/
│   │   ├── rent/
│   │   ├── rent-motorbike/
│   │   ├── services/
│   │   ├── user/
│   │   └── ...
│   ├── components/                   # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/                        # Custom hooks
│   │   ├── useProperties.ts
│   │   ├── useProperty.ts
│   │   ├── useMotorcycles.ts
│   │   └── ...
│   ├── lib/                          # Utilities
│   │   ├── supabase.ts              # Client-side Supabase
│   │   ├── supabaseAdmin.ts         # Server-side Supabase (service role)
│   │   ├── auth.ts                  # JWT auth functions
│   │   ├── api-auth.ts              # API auth verification
│   │   └── ...
│   ├── types/                        # TypeScript types
│   │   ├── index.ts
│   │   └── motorcycle.ts
│   ├── middleware.ts                 # Next.js middleware
│   └── ...
├── supabase/
│   └── migrations/                   # Database migrations
│       └── create_motorcycles_table.sql
├── public/                           # Static assets
│   ├── logo.svg
│   └── ...
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
```

---

## 🔐 Security Features

✅ **Authentication:**
- JWT-based authentication
- Secure password hashing (bcrypt)
- Token expiration
- Refresh token support (if implemented)

✅ **Authorization:**
- Role-based access control (RBAC)
- Route protection middleware
- API endpoint protection
- Row Level Security (RLS) in Supabase

✅ **Data Protection:**
- Input validation (Zod)
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)
- CSRF protection
- Rate limiting

✅ **Security Headers:**
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)
- Referrer-Policy

---

## 📊 Analytics & Tracking

✅ **Property Analytics:**
- View counts
- Favorite counts
- Search impressions
- Contact requests

✅ **User Analytics:**
- Registration sources (UTM tracking)
- User activity
- Property interactions

✅ **Business Metrics:**
- Investment leads
- Conversion rates
- Popular locations
- Price trends

---

## 🚀 Deployment

### **Platform:** Vercel

### **Build Process:**
1. Install dependencies
2. Run type checking
3. Run linting
4. Build Next.js app
5. Deploy to Vercel

### **Environment Variables:**
Set in Vercel dashboard:
- All required env vars
- Production URLs
- API keys

### **Database:**
- Supabase hosted PostgreSQL
- Migrations run manually or via Supabase CLI

### **Storage:**
- Supabase Storage for images
- Bucket: `property-images`

---

## 📝 Notes

1. **Motorcycles vs Properties:**
   - Motorcycles are in separate `motorcycles` table
   - NOT in `properties` table
   - Separate API endpoints (`/api/motorcycles`)
   - Separate hooks (`useMotorcycles`)

2. **RLS Policies:**
   - All tables have RLS enabled
   - Service role key (used in API routes) bypasses RLS
   - Public/anonymous users have limited access

3. **Image Upload:**
   - Uses Supabase Storage
   - Upload via `/api/properties/images`
   - Same bucket for properties and motorcycles

4. **Authentication:**
   - Two separate auth systems:
     - Regular users: `users` table
     - Admins: `admin_users` table
   - Same login endpoint, different tables

5. **i18n:**
   - Supports English and Indonesian
   - Routes: `/[locale]/...`
   - Default locale: English

---

Bu dokümantasyon, Estate Bali uygulamasının tüm özelliklerini, şemalarını ve yapısını içerir. Entegrasyon için referans olarak kullanabilirsiniz.


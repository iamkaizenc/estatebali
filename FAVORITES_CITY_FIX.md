# Fix: Favorites API - City Column Error

## Problem
The favorites API endpoint was returning an error:
```
Error fetching favorites: {
  code: '42703',
  message: 'column properties_1.city does not exist'
}
```

This occurred because the query was trying to select a `city` column from the `properties` table that doesn't exist in the actual Supabase database schema.

## Root Cause
- The `schema.sql` file defines a `city` column in the `properties` table
- However, the actual database schema doesn't have this column
- The favorites query was explicitly selecting `city` in a nested relation query

## Solution

### 1. API Route Fix (`src/app/api/favorites/route.ts`)
**Changed:**
- Removed `city` from the SELECT query
- Added `address` to the SELECT query instead
- Added a comment explaining the change

**Before:**
```typescript
properties (
  id,
  title,
  type,
  listing_type,
  price,
  area,
  city,  // ❌ This column doesn't exist
  images,
  featured,
  verified
)
```

**After:**
```typescript
properties (
  id,
  title,
  type,
  listing_type,
  price,
  area,
  address,  // ✅ Using address instead
  images,
  featured,
  verified
)
```

### 2. Frontend Fix (`src/app/user/favorites/page.tsx`)
**Changed:**
- Updated the data transformation to derive `city` from `address` or use `area` as fallback
- Added logic to extract city from address string (e.g., "Bali, Indonesia" → "Bali")

**Before:**
```typescript
location: {
  area: prop.area,
  city: prop.city,  // ❌ undefined
  address: "",
}
```

**After:**
```typescript
const address = prop.address || "";
const area = prop.area || "";
const city = address.split(",")[0]?.trim() || area || "";

location: {
  area: area,
  city: city,  // ✅ Derived from address or area
  address: address,
}
```

## Files Changed

1. **src/app/api/favorites/route.ts**
   - Removed `city` from properties SELECT query
   - Added `address` to properties SELECT query
   - Added explanatory comment

2. **src/app/user/favorites/page.tsx**
   - Updated data transformation to handle missing `city` field
   - Added logic to derive `city` from `address` or `area`

## API Response Shape

The favorites API now returns:
```typescript
{
  success: true,
  data: [
    {
      id: string,
      property_id: string,
      created_at: string,
      properties: {
        id: string,
        title: string,
        type: string,
        listing_type: string,
        price: number,
        area: string | null,
        address: string | null,  // ✅ Now included
        images: string[] | null,
        featured: boolean,
        verified: boolean
      }
    }
  ]
}
```

## Verification

To verify the fix:
1. The error `column properties_1.city does not exist` should no longer occur
2. The favorites endpoint should return data successfully
3. The frontend should display favorites with location information derived from `address` or `area`

## Notes

- The `city` column may exist in `schema.sql` but not in the actual database
- If you need to add the `city` column to the database, run:
  ```sql
  ALTER TABLE properties ADD COLUMN city VARCHAR(100);
  ```
- The current solution works without requiring a database migration
- The frontend gracefully handles the missing `city` field by deriving it from available data


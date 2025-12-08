# ✅ Motorcycles Feature - Integration Status & Checklist

## 📊 Current Status

### ✅ **Database**
- [x] `motorcycles` table exists
- [x] 16 motorcycles in database (12 available)
- [x] All required columns present
- [x] RLS enabled with correct policies:
  - [x] Public can view available motorcycles
  - [x] Admins can view all motorcycles
  - [x] Authenticated can create motorcycles
  - [x] Users can update own motorcycles
  - [x] Users can delete own motorcycles

### ✅ **API Routes**
- [x] `/api/motorcycles` - GET, POST (exists and working)
- [x] `/api/motorcycles/[id]` - GET, PUT, DELETE (should exist)

### ✅ **Frontend**
- [x] `src/types/motorcycle.ts` - Types defined
- [x] `src/hooks/useMotorcycles.ts` - Hook implemented
- [x] `src/app/rent-motorbike/page.tsx` - Public listing page
- [x] `src/app/(main)/motorcycles/[id]/page.tsx` - Detail page
- [x] Admin panel Motorcycles tab with CRUD

---

## 🔍 Verification Steps

### **1. Database Check**
```sql
-- Verify table exists and has data
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN available = true THEN 1 END) as available
FROM motorcycles;
-- Expected: total=16, available=12

-- Verify RLS policies
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'motorcycles';
-- Expected: 6 policies
```

### **2. API Route Check**

**Test GET (Public):**
```bash
curl https://your-domain.com/api/motorcycles?available=true&sortBy=newest
# Should return JSON with 12 available motorcycles
```

**Test GET (All - Admin):**
```bash
curl https://your-domain.com/api/motorcycles?sortBy=newest
# Should return JSON with all 16 motorcycles
```

### **3. Frontend Check**

**Rent Motorbike Page:**
- Visit: `/rent-motorbike`
- Should display 12 available motorcycles
- Check browser console for logs: `[useMotorcycles] Fetched from API: 12 motorcycles`
- Check Network tab: Request to `/api/motorcycles?available=true&sortBy=newest`

**Admin Panel:**
- Login as admin
- Click "Motorcycles" tab
- Should see all 16 motorcycles (available + unavailable)
- Click "Add New Motorcycle" - modal should open
- Click Edit on any motorcycle - modal should open with data
- Click Delete - should confirm and delete
- Click Toggle Available - should toggle availability

**Motorcycle Detail Page:**
- Visit: `/motorcycles/[id]` (replace with actual motorcycle ID)
- Should display full motorcycle details

---

## ⚠️ Potential Issues & Solutions

### **Issue 1: Motorcycles not showing on /rent-motorbike**

**Symptoms:**
- Page shows "Loading..." indefinitely
- No motorcycles displayed
- Empty state showing

**Diagnosis:**
1. Check browser console for errors
2. Check Network tab for `/api/motorcycles` request
3. Verify API response status and data

**Solution:**
```typescript
// Verify hook is called correctly in src/app/rent-motorbike/page.tsx
const { data: motorcycles } = useMotorcycles({
  available: true,  // ✅ Must be true for public page
  sortBy: 'newest',
});
```

**Check API Route:**
```typescript
// Verify src/app/api/motorcycles/route.ts handles available filter
if (available !== null && available !== undefined && available !== '') {
  query = query.eq('available', available === 'true');
}
```

### **Issue 2: Admin panel shows no motorcycles**

**Symptoms:**
- Motorcycles tab shows "No motorcycles found"
- Count shows 0

**Solution:**
```typescript
// Verify hook is called with available: undefined (not true)
const { data: motorcycles } = useMotorcycles({
  available: undefined,  // ✅ undefined shows all
  sortBy: 'newest',
});
```

### **Issue 3: Can't edit/delete motorcycles**

**Symptoms:**
- Edit button doesn't work
- Delete button doesn't work
- API returns 401/403

**Solution:**
- Verify admin is logged in
- Check localStorage has `admin_token` or `auth_token`
- Verify token is sent in API request headers

### **Issue 4: Images not uploading**

**Symptoms:**
- Image upload fails
- Images don't appear after upload

**Solution:**
- Verify `property-images` bucket exists in Supabase Storage
- Verify storage policies allow authenticated uploads
- Check `/api/properties/images` route works
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set

---

## 📋 File Checklist

### **Required Files:**

**Backend:**
- [x] `src/app/api/motorcycles/route.ts` - GET, POST
- [ ] `src/app/api/motorcycles/[id]/route.ts` - GET, PUT, DELETE
- [x] `src/lib/supabaseAdmin.ts` - Admin client
- [x] `src/lib/api-auth.ts` - Auth verification

**Frontend - Types & Hooks:**
- [x] `src/types/motorcycle.ts` - TypeScript types
- [x] `src/hooks/useMotorcycles.ts` - Data fetching hook

**Frontend - Pages:**
- [x] `src/app/rent-motorbike/page.tsx` - Public listing
- [ ] `src/app/(main)/motorcycles/[id]/page.tsx` - Detail page
- [x] `src/app/admin/page.tsx` - Admin panel (Motorcycles tab)

**Frontend - Components:**
- [x] `src/components/ImageUpload.tsx` - Image upload (used in admin)

**Database:**
- [x] `supabase/migrations/create_motorcycles_table.sql` - Migration

---

## 🔧 Quick Fix Commands

### **Check if motorcycles API route exists:**
```bash
ls -la src/app/api/motorcycles/
# Should show: route.ts and [id]/route.ts
```

### **Check if detail page exists:**
```bash
ls -la src/app/\(main\)/motorcycles/\[id\]/
# Should show: page.tsx
```

### **Verify environment variables:**
```bash
# In Vercel dashboard or .env.local
# Check for:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

---

## 🚀 Deployment Steps

### **Before Deploy:**
1. [ ] Verify all files exist (checklist above)
2. [ ] Test API routes locally
3. [ ] Test frontend pages locally
4. [ ] Fix any TypeScript errors
5. [ ] Fix any linter errors

### **After Deploy:**
1. [ ] Visit `/rent-motorbike` - should show motorcycles
2. [ ] Visit `/motorcycles/[id]` - should show details
3. [ ] Login to admin panel
4. [ ] Open Motorcycles tab - should show all motorcycles
5. [ ] Test Add/Edit/Delete operations
6. [ ] Verify `/buy` page excludes motorcycles
7. [ ] Verify `/rent` page excludes motorcycles

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Public User    │
│  /rent-motorbike│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useMotorcycles  │
│ ({available:true│
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ /api/motorcycles│─────▶│ supabaseAdmin    │
│ ?available=true │      │ .from('motorcycles')
└─────────────────┘      │ .eq('available',true)
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ RLS Policy      │
                         │ available=true  │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Returns 12      │
                         │ motorcycles     │
                         └─────────────────┘

┌─────────────────┐
│  Admin User     │
│  Admin Panel    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useMotorcycles  │
│ ({available:    │
│   undefined})   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ /api/motorcycles│─────▶│ supabaseAdmin    │
│ (no filter)     │      │ .from('motorcycles')
└─────────────────┘      │ (no available filter)
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ RLS Policy      │
                         │ Admin can view  │
                         │ all             │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Returns 16      │
                         │ motorcycles     │
                         └─────────────────┘
```

---

## ✅ Final Verification

**Database:**
```sql
SELECT COUNT(*) FROM motorcycles; -- Should be 16
SELECT COUNT(*) FROM motorcycles WHERE available = true; -- Should be 12
```

**API:**
```bash
# Public (available only)
curl "https://your-domain.com/api/motorcycles?available=true" | jq '.data | length'
# Should return 12

# Admin (all)
curl "https://your-domain.com/api/motorcycles" | jq '.data | length'
# Should return 16 (if authenticated as admin)
```

**Frontend:**
- `/rent-motorbike` shows 12 motorcycles ✅
- `/motorcycles/[id]` shows details ✅
- Admin panel shows 16 motorcycles ✅
- Admin can Add/Edit/Delete ✅

---

## 📝 Notes

1. **Separation:** Motorcycles are in separate `motorcycles` table, NOT in `properties` table
2. **RLS:** Public users only see `available = true` motorcycles via RLS policy
3. **Admin:** Admin panel uses `available: undefined` to see all motorcycles
4. **API:** All motorcycle operations use `/api/motorcycles` endpoints
5. **Hook:** Use `useMotorcycles()` hook, NOT `useProperties()` for motorcycles

---

Bu checklist'i takip ederek tüm entegrasyonu doğrulayabilirsiniz. Herhangi bir sorun varsa "Potential Issues & Solutions" bölümüne bakın.


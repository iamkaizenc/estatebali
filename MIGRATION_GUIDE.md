# Estate Bali - Feature Integration Migration Guide

**Date**: November 22, 2025
**Version**: 1.0

This guide explains how to integrate new features from the Estate-Bali mobile app into the estatebali website.

---

## 🎯 New Features Integrated

### ✅ Completed in This Migration:

1. **Investment Lead System** - Capture and manage investment inquiries
2. **Notifications System** - Real-time user notifications
3. **Bookings System** - Short-term rental reservations
4. **Saved Searches** - Save and manage property search filters
5. **Enhanced Property Fields** - 50+ new property attributes
6. **Conversations Enhancement** - Improved messaging structure

---

## 📦 What's Included

### 1. Database Schema (`database-migrations.sql`)

Run this SQL file in your Supabase SQL Editor to create:

- `investment_leads` table
- `notifications` table
- `bookings` table
- `saved_searches` table
- `conversations` table (enhanced)
- Enhanced `properties` table with new fields
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp triggers

**Important**: Before running, ensure you have a backup of your database!

### 2. TypeScript Types (`src/types/index.ts`)

Updated with new interfaces:
- `InvestmentLead`
- `Notification`
- `Booking`
- `SavedSearch`
- `Conversation`
- Enhanced `Property` interface with new fields

### 3. API Routes

**Investment Leads:**
- `POST /api/investment-leads` - Create lead
- `GET /api/investment-leads` - Get all leads (admin)
- `PATCH /api/investment-leads/[id]` - Update lead
- `DELETE /api/investment-leads/[id]` - Delete lead

**Notifications:**
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification (admin)
- `PATCH /api/notifications/[id]` - Mark as read
- `DELETE /api/notifications/[id]` - Delete notification

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

**Saved Searches:**
- `POST /api/saved-searches` - Save search
- `GET /api/saved-searches` - Get saved searches

### 4. React Components

**Investment Lead Form** (`components/InvestmentLeadForm.tsx`)
- Beautiful modal form for investment inquiries
- Form validation
- Success/error states
- Integration with Investment Leads API

**Notification Bell** (`components/NotificationBell.tsx`)
- Real-time notification dropdown
- Unread count badge
- Mark as read functionality
- Auto-refresh every 30 seconds

---

## 🚀 Installation Steps

### Step 1: Database Migration

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `database-migrations.sql`
4. Run the migration
5. Verify all tables are created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

### Step 2: Environment Variables

No new environment variables required! All APIs use existing Supabase configuration.

### Step 3: Install Dependencies (if needed)

All dependencies are already in package.json:
- `framer-motion` - Animations (already installed)
- `lucide-react` - Icons (already installed)

### Step 4: Integrate Components

**Add Notification Bell to Header:**

```typescript
// In src/components/Header.tsx
import NotificationBell from "@/components/NotificationBell";

// Add in desktop actions section (around line 58):
<NotificationBell />
```

**Use Investment Lead Form:**

```typescript
// Example usage in any component
import InvestmentLeadForm from "@/components/InvestmentLeadForm";
import { useState } from "react";

function MyComponent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(true)}>
        Get Investment Consultation
      </button>

      {showForm && (
        <InvestmentLeadForm onClose={() => setShowForm(false)} />
      )}
    </>
  );
}
```

### Step 5: Build and Test

```bash
npm run build
npm run dev
```

Visit:
- `/api/notifications` - Test API
- Click notification bell in header
- Test investment form

---

## 📝 Next Steps (Not Yet Implemented)

### Phase 4: Property Forms Update
- Update `/create` page with new property fields
- Update `/property/[id]/edit` page
- Add leasehold, energy class, heating type fields

### Phase 5: Admin Features
- Admin approval system (`/admin/approvals`)
- Investment leads management (`/admin/leads`)
- Analytics dashboard (`/admin/analytics`)

### Phase 6: Additional Pages
- `/user/notifications` - Full notifications page
- `/user/bookings` - Bookings management
- `/user/saved-searches` - Saved searches page

---

## 🔧 API Integration with Supabase

All API routes include TODO comments where Supabase integration should be added:

```typescript
// TODO: Insert into Supabase
// const { data, error } = await supabase
//   .from('investment_leads')
//   .insert([lead])
//   .select()
//   .single();
```

To activate:
1. Uncomment Supabase code
2. Add Supabase client initialization
3. Test with your database

---

## 🎨 Property Field Enhancements

New fields added to Property interface:

**Leasehold (Foreign Buyers):**
- `leaseholdYears?: number`
- `leaseholdExtendable?: boolean`

**Energy & Environment:**
- `energyClass?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'`
- `heatingType?: 'autonomous' | 'central' | 'none'`
- `heatingMedium?: 'oil' | 'gas' | 'electric' | 'solar' | 'none'`

**Additional Details:**
- `wc?: number` - Separate toilet count
- `kitchens?: number`
- `livingRooms?: number`
- `plotSize?: number` - Land size
- `levels?: number` - Building floors
- `floor?: number` - Which floor

**Features:**
- `warehouse?: boolean`
- `securityDoor?: boolean`
- `alarm?: boolean`
- `fireplace?: boolean`
- `solarWaterHeater?: boolean`
- `penthouse?: boolean`

**Status & Info:**
- `newDevelopment?: boolean`
- `priceReduced?: boolean`
- `suitableForStudents?: boolean`
- `wheelchairAccessible?: boolean`
- `averageMonthlyExpenses?: number`
- `distanceFromSea?: string`
- `availableFrom?: string`
- `status?: 'pending' | 'approved' | 'rejected'`

---

## ⚠️ Important Notes

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Authentication Required**: Most endpoints require valid JWT token
3. **Admin Access**: Some endpoints require admin role
4. **Database Backup**: Always backup before running migrations
5. **Testing**: Test all features in development before production

---

## 🐛 Troubleshooting

**API Returns 401 Unauthorized:**
- Check if auth_token cookie is set
- Verify JWT token is valid
- Check user role permissions

**Database Migration Fails:**
- Check if tables already exist
- Verify UUID extension is enabled
- Check for conflicting column names

**Components Not Rendering:**
- Check if "use client" directive is present
- Verify imports are correct
- Check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check `FEATURE_INTEGRATION_PLAN.md` for detailed implementation plan
2. Review API route comments for Supabase integration
3. Test endpoints using tools like Postman

---

**Created by**: Claude Code AI Assistant
**Last Updated**: November 22, 2025

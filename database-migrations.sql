-- ============================================================================
-- Estate Bali - Comprehensive Database Migration
-- Features: Investment Leads, Notifications, Bookings, Saved Searches,
--           Conversations, Enhanced Properties, Admin Approval
-- Date: 2025-11-22
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. INVESTMENT LEADS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS investment_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  investment_amount BIGINT,
  investment_type TEXT, -- 'property', 'land', 'villa', etc.
  preferred_location TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'converted', 'closed'
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin/Agent assigned
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_investment_leads_user_id ON investment_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_leads_status ON investment_leads(status);
CREATE INDEX IF NOT EXISTS idx_investment_leads_created_at ON investment_leads(created_at DESC);

-- RLS Policies
ALTER TABLE investment_leads ENABLE ROW LEVEL SECURITY;

-- Users can view their own leads
CREATE POLICY investment_leads_select_own ON investment_leads
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can create a lead (for contact forms)
CREATE POLICY investment_leads_insert_all ON investment_leads
  FOR INSERT WITH CHECK (true);

-- Only admins can update leads
CREATE POLICY investment_leads_update_admin ON investment_leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- 2. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error', 'property', 'message', 'booking'
  action_url TEXT, -- Optional link to relevant page
  read BOOLEAN DEFAULT false,
  data JSONB, -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Only system/admin can create notifications
CREATE POLICY notifications_insert_admin ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Users can delete their own notifications
CREATE POLICY notifications_delete_own ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 3. BOOKINGS TABLE (Short-term rentals)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price BIGINT NOT NULL,
  booking_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  special_requests TEXT,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,

  -- Constraints
  CONSTRAINT check_dates CHECK (check_out > check_in),
  CONSTRAINT check_guests CHECK (guests > 0),
  CONSTRAINT check_price CHECK (total_price > 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY bookings_select_own ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Property owners can view bookings for their properties
CREATE POLICY bookings_select_property_owner ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.contact->>'email' = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Authenticated users can create bookings
CREATE POLICY bookings_insert_authenticated ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings
CREATE POLICY bookings_update_own ON bookings
  FOR UPDATE USING (auth.uid() = user_id AND booking_status = 'pending');

-- Property owners can update bookings for their properties
CREATE POLICY bookings_update_property_owner ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.contact->>'email' = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ============================================================================
-- 4. SAVED SEARCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  alert_enabled BOOLEAN DEFAULT false,
  alert_frequency TEXT DEFAULT 'daily', -- 'instant', 'daily', 'weekly'
  last_alert_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_alert ON saved_searches(alert_enabled);

-- RLS Policies
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own saved searches
CREATE POLICY saved_searches_all_own ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 5. CONVERSATIONS TABLE (Enhanced)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure buyer and seller are different
  CONSTRAINT different_users CHECK (buyer_id != seller_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_property_id ON conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can view conversations they're part of
CREATE POLICY conversations_select_participant ON conversations
  FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));

-- Users can create conversations
CREATE POLICY conversations_insert_authenticated ON conversations
  FOR INSERT WITH CHECK (auth.uid() IN (buyer_id, seller_id));

-- Participants can update conversations
CREATE POLICY conversations_update_participant ON conversations
  FOR UPDATE USING (auth.uid() IN (buyer_id, seller_id));

-- ============================================================================
-- 6. UPDATE MESSAGES TABLE (if exists, enhance it)
-- ============================================================================
-- Add conversation_id if not exists
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Add indexes if not exist
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- ============================================================================
-- 7. ENHANCE PROPERTIES TABLE - Add new fields
-- ============================================================================

-- Leasehold Information (important for foreign buyers in Bali)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS leasehold_years INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS leasehold_extendable BOOLEAN DEFAULT false;

-- Energy & Environmental
ALTER TABLE properties ADD COLUMN IF NOT EXISTS energy_class TEXT; -- 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'
ALTER TABLE properties ADD COLUMN IF NOT EXISTS heating_type TEXT; -- 'autonomous', 'central', 'none'
ALTER TABLE properties ADD COLUMN IF NOT EXISTS heating_medium TEXT; -- 'oil', 'gas', 'electric', 'solar', 'none'

-- Property Status
ALTER TABLE properties ADD COLUMN IF NOT EXISTS new_development BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_reduced BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved'; -- 'pending', 'approved', 'rejected'

-- Additional Rooms & Features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS wc INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS kitchens INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS living_rooms INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor INTEGER DEFAULT 0; -- Which floor the property is on

-- Interior Features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_warehouse BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_security_door BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_alarm BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_fireplace BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_solar_water_heater BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN DEFAULT false;

-- Exterior Features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_penthouse BOOLEAN DEFAULT false;

-- Accessibility & Suitability
ALTER TABLE properties ADD COLUMN IF NOT EXISTS suitable_for_students BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT false;

-- Financial & Availability
ALTER TABLE properties ADD COLUMN IF NOT EXISTS average_monthly_expenses BIGINT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_from_sea TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_from TEXT;

-- Size Information
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_size INTEGER; -- Land/plot size in m²
ALTER TABLE properties ADD COLUMN IF NOT EXISTS levels INTEGER; -- Number of floors/levels

-- Add indexes for new filterable fields
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_energy_class ON properties(energy_class);
CREATE INDEX IF NOT EXISTS idx_properties_new_development ON properties(new_development);
CREATE INDEX IF NOT EXISTS idx_properties_price_reduced ON properties(price_reduced);

-- Update RLS policy to respect status field
DROP POLICY IF EXISTS properties_select_all ON properties;
CREATE POLICY properties_select_approved ON properties
  FOR SELECT USING (status = 'approved' OR auth.uid()::text = (contact->>'user_id'));

-- ============================================================================
-- 8. CREATE FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_investment_leads_updated_at ON investment_leads;
CREATE TRIGGER update_investment_leads_updated_at
  BEFORE UPDATE ON investment_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_searches_updated_at ON saved_searches;
CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample notification types for reference
COMMENT ON COLUMN notifications.type IS 'Notification types: info, success, warning, error, property, message, booking, price_drop, new_listing';

-- Sample investment lead statuses
COMMENT ON COLUMN investment_leads.status IS 'Status: pending, contacted, converted, closed';

-- Sample booking statuses
COMMENT ON COLUMN bookings.booking_status IS 'Booking status: pending, confirmed, cancelled, completed';
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: pending, paid, refunded';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify all tables exist
SELECT 'Migration completed successfully!' AS status;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'investment_leads',
  'notifications',
  'bookings',
  'saved_searches',
  'conversations',
  'messages',
  'properties'
)
ORDER BY table_name;

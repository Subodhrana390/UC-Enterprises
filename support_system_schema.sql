-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES profiles(id),
  
  -- Contact info for guest users
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT
);

-- Support Ticket Messages/Replies
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_staff_reply BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Ticket Attachments
CREATE TABLE IF NOT EXISTS support_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES support_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_faq_items_category_id ON faq_items(category_id);

-- RLS Policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Support Tickets Policies
CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own tickets"
  ON support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all tickets"
  ON support_tickets FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Support Messages Policies
CREATE POLICY "Users can view messages for their tickets"
  ON support_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid() OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages for their tickets"
  ON support_messages FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON support_messages FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can create messages"
  ON support_messages FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- FAQ Policies (public read)
CREATE POLICY "Anyone can view FAQ categories"
  ON faq_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view FAQ items"
  ON faq_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage FAQ categories"
  ON faq_categories FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage FAQ items"
  ON faq_items FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their subscription"
  ON newsletter_subscriptions FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM support_tickets;
  new_number := 'TK-' || LPAD(counter::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket number
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

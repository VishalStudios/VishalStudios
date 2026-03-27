-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    admin_id TEXT DEFAULT 'vishalriya26',
    admin_password TEXT DEFAULT 'Vishalriya26',
    phone TEXT DEFAULT '9667517894',
    email TEXT DEFAULT 'yourbrandstudio705@gmail.com',
    location TEXT DEFAULT 'Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305',
    facebook_link TEXT DEFAULT '#',
    instagram_link TEXT DEFAULT 'https://instagram.com/vishal_kushwaha21',
    disabled_sections TEXT[] DEFAULT '{}'
);

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305';

-- Insert or update default settings
INSERT INTO site_settings (
    id,
    admin_id,
    admin_password,
    phone,
    email,
    location,
    facebook_link,
    instagram_link
)
VALUES (
    1,
    'vishalriya26',
    'Vishalriya26',
    '9667517894',
    'yourbrandstudio705@gmail.com',
    'Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305',
    '#',
    'https://instagram.com/vishal_kushwaha21'
)
ON CONFLICT (id) DO UPDATE SET
    admin_id = EXCLUDED.admin_id,
    admin_password = EXCLUDED.admin_password,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    location = EXCLUDED.location,
    facebook_link = EXCLUDED.facebook_link,
    instagram_link = EXCLUDED.instagram_link;

-- Create site_images table
CREATE TABLE IF NOT EXISTS site_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    url TEXT NOT NULL,
    section TEXT NOT NULL,
    category TEXT,
    title TEXT,
    description TEXT,
    media_type TEXT DEFAULT 'image'
);

-- Create clients table for Private Gallery
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    wedding_date TEXT,
    photo_url TEXT,
    drive_link TEXT,
    password TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they already exist
DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Read Images" ON site_images;
DROP POLICY IF EXISTS "Public Read Clients" ON clients;
DROP POLICY IF EXISTS "Public Full Access Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Full Access Images" ON site_images;
DROP POLICY IF EXISTS "Public Full Access Clients" ON clients;

-- Create policies
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Images" ON site_images FOR SELECT USING (true);
CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);

CREATE POLICY "Public Full Access Settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Public Full Access Images" ON site_images FOR ALL USING (true);
CREATE POLICY "Public Full Access Clients" ON clients FOR ALL USING (true);

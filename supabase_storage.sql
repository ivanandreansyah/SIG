-- Create the 'locations' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('locations', 'locations', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled, though it usually is by default)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to view files in 'locations' bucket
CREATE POLICY "Public Access Locations"
ON storage.objects FOR SELECT
USING ( bucket_id = 'locations' );

-- Policy: Allow public to upload files to 'locations' bucket
CREATE POLICY "Public Upload Locations"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'locations' );

-- Policy: Allow public to delete their own files (optional, but good for cleanup if needed)
-- reliable deletion might require more complex auth checks, but for now we can omit or allow all
CREATE POLICY "Public Update Locations"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'locations' );

CREATE POLICY "Public Delete Locations"
ON storage.objects FOR DELETE
USING ( bucket_id = 'locations' );

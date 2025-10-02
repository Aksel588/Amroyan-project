-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog images
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

-- Add new columns to blog_posts table for enhanced functionality
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT;
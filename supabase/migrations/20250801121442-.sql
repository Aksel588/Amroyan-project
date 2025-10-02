-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  slug TEXT NOT NULL UNIQUE,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Everyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can insert blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blog_posts (title, excerpt, content, category, slug, featured, published) VALUES
('Հարկային օրենսդրության փոփոխություններ 2024թ.', 'Ծանոթացեք 2024 թվականի հարկային օրենսդրության կարևոր փոփոխություններին', 'Հարկային օրենսդրության փոփոխություններ 2024թ. բովանդակություն...', 'Հարկային', 'tax-changes-2024', true, true),
('Բիզնեսի գրանցում ՀՀ-ում. քայլ առ քայլ ուղեցույց', 'Իմացեք ինչպես գրանցել ձեր բիզնեսը Հայաստանում', 'Բիզնեսի գրանցման ուղեցույց բովանդակություն...', 'Բիզնես', 'business-registration-guide', false, true),
('Աշխատանքային իրավունքի նոր չափանիշներ', 'Աշխատանքային իրավունքի բնագավառում տեղի ունեցած փոփոխությունները', 'Աշխատանքային իրավունք բովանդակություն...', 'Իրավունք', 'labor-law-changes', false, true);
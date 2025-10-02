-- Create course applications table
CREATE TABLE IF NOT EXISTS public.course_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_from text, -- e.g., 'accounting_course_card'
  processed_by uuid -- admin user id
);

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_course_applications_updated_at
BEFORE UPDATE ON public.course_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.course_applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can insert an application
CREATE POLICY "Anyone can insert course applications"
ON public.course_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can select all applications
CREATE POLICY "Admins can view applications"
ON public.course_applications
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.role = 'admin'
));

-- Admins can update applications (e.g., approve/reject, processed_by)
CREATE POLICY "Admins can update applications"
ON public.course_applications
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.role = 'admin'
));

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
ON public.course_applications
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.role = 'admin'
));
-- Phase 1: Privilege escalation hardening for profiles
-- 1) Helper function to check roles without RLS recursion
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = _user_id and p.role = _role
  );
$$;

-- 2) Trigger to prevent non-admins from changing role
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only run on UPDATEs that attempt to change the role
  if TG_OP = 'UPDATE' and NEW.role is distinct from OLD.role then
    -- Allow only admins to change roles
    if not public.has_role(auth.uid(), 'admin') then
      raise exception 'Insufficient privileges to change role';
    end if;
  end if;
  return NEW;
end;
$$;

-- Create trigger on profiles
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
create trigger trg_prevent_role_escalation
before update on public.profiles
for each row
execute function public.prevent_role_escalation();

-- 3) RLS: Add admin privileges for viewing and updating profiles
-- Enable RLS if not already (safe to run)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Admins can view all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- Admins can update any profile (role changes allowed, enforced by trigger)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can update any profile'
  ) THEN
    CREATE POLICY "Admins can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- Users can update their own profile (existing policy may exist; ensure it does)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

-- 4) Ensure profiles auto-creation on signup (if missing)
-- Create trigger on auth.users to insert into profiles using existing function
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created' AND n.nspname = 'auth' AND c.relname = 'users'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;
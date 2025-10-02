-- Create table for calculator rates
create table if not exists public.calculator_rates (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.calculators(id) on delete cascade,
  label text not null,
  rate numeric(10,4) not null,
  visible boolean not null default true,
  sort_order integer not null default 0,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.calculator_rates enable row level security;

-- Indexes
create index if not exists idx_calculator_rates_calculator on public.calculator_rates(calculator_id);
create index if not exists idx_calculator_rates_visible on public.calculator_rates(visible);
create index if not exists idx_calculator_rates_sort on public.calculator_rates(calculator_id, sort_order);

-- Timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_calculator_rates_updated_at on public.calculator_rates;
create trigger trg_calculator_rates_updated_at
before update on public.calculator_rates
for each row execute function public.update_updated_at_column();

-- Policies via conditional blocks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calculator_rates' AND policyname='Admins can view all rates'
  ) THEN
    CREATE POLICY "Admins can view all rates"
    ON public.calculator_rates
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calculator_rates' AND policyname='Admins can insert rates'
  ) THEN
    CREATE POLICY "Admins can insert rates"
    ON public.calculator_rates
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calculator_rates' AND policyname='Admins can update rates'
  ) THEN
    CREATE POLICY "Admins can update rates"
    ON public.calculator_rates
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calculator_rates' AND policyname='Admins can delete rates'
  ) THEN
    CREATE POLICY "Admins can delete rates"
    ON public.calculator_rates
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='calculator_rates' AND policyname='Public can view visible rates'
  ) THEN
    CREATE POLICY "Public can view visible rates"
    ON public.calculator_rates
    FOR SELECT
    USING (visible = true);
  END IF;
END$$;

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.calculator_rates;
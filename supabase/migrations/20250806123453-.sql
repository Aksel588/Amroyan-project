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

-- Policies: Admins full access
create policy if not exists "Admins can view all rates"
  on public.calculator_rates for select
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can insert rates"
  on public.calculator_rates for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update rates"
  on public.calculator_rates for update
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete rates"
  on public.calculator_rates for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Public can view visible rates (for runtime calculators)
create policy if not exists "Public can view visible rates"
  on public.calculator_rates for select
  using (visible = true);

-- Realtime publication (optional, safe if already added)
alter publication supabase_realtime add table public.calculator_rates;
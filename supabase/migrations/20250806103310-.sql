-- Create calculators table
create table if not exists public.calculators (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  icon_name text not null default 'Calculator',
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.calculators enable row level security;

-- Timestamps trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_calculators_updated_at
before update on public.calculators
for each row execute function public.update_updated_at_column();

-- Policies using profiles.role = 'admin'
create policy "Admins can view calculators"
  on public.calculators
  for select
  using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

create policy "Admins can insert calculators"
  on public.calculators
  for insert
  with check (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

create policy "Admins can update calculators"
  on public.calculators
  for update
  using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

create policy "Admins can delete calculators"
  on public.calculators
  for delete
  using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

-- Public can view visible calculators
create policy "Public can view visible calculators"
  on public.calculators
  for select
  using (visible = true);

-- Helpful index for ordering
create index if not exists idx_calculators_visible_order on public.calculators (visible, sort_order);

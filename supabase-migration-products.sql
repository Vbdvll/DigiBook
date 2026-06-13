create table if not exists public.upcoming_products (
  id uuid primary key,
  name text not null,
  product_type text not null default 'Audio',
  description text not null default '',
  image_url text not null default '',
  status text not null default 'Bientot disponible',
  expected_date text not null default '',
  notify_enabled boolean not null default true,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key,
  platform text not null,
  label text not null default '',
  url text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.upcoming_products enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "Public can read upcoming products" on public.upcoming_products;
create policy "Public can read upcoming products"
  on public.upcoming_products for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read social links" on public.social_links;
create policy "Public can read social links"
  on public.social_links for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage upcoming products" on public.upcoming_products;
create policy "Admins can manage upcoming products"
  on public.upcoming_products for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can manage social links" on public.social_links;
create policy "Admins can manage social links"
  on public.social_links for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

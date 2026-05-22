create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  site_name text not null default 'DigiBook',
  currency text not null default 'FC',
  whatsapp text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.packs (
  id uuid primary key,
  name text not null,
  count integer not null default 0,
  price integer not null default 0,
  original_price integer not null default 0,
  description text not null default '',
  featured boolean not null default false,
  enabled boolean not null default true,
  books text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key,
  title text not null,
  author text not null default '',
  category text not null default 'Autres',
  cover text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.packs enable row level security;
alter table public.books enable row level security;

create policy "Public can read settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Public can read packs"
  on public.packs for select
  to anon, authenticated
  using (true);

create policy "Public can read books"
  on public.books for select
  to anon, authenticated
  using (true);

create policy "Admins can read admin list"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can manage settings"
  on public.site_settings for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can manage packs"
  on public.packs for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can manage books"
  on public.books for all
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into public.site_settings (id, site_name, currency, whatsapp)
values ('default', 'DigiBook', 'FC', '')
on conflict (id) do nothing;

-- Apres avoir cree ton utilisateur admin dans Supabase Auth,
-- remplace l'UUID ci-dessous par son id puis execute cette ligne:
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');

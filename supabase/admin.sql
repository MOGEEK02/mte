-- MTE website: admin panel (/admin).
-- Run once in Supabase → SQL Editor for the WEBSITE project. Safe to run again.
--
-- Before running: Authentication → Users → "Add user" with your e-mail and a strong
-- password ("Auto confirm user" ticked). The last statement makes that account the admin.

-- ---------------------------------------------------------------------------
-- 1. Admin accounts
-- ---------------------------------------------------------------------------
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;

-- True for an admin. Once two-factor authentication is enabled on the account,
-- the session must also have passed it (aal2).
create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid())
    and (
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified')
    );
$$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Portfolio: visibility and link to a service
-- ---------------------------------------------------------------------------
alter table public.portfolio add column if not exists published boolean not null default true;
alter table public.portfolio add column if not exists service_slug text;
alter table public.portfolio add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- 3. Services (/services/<slug>)
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  art text not null default 'ladder' check (art in ('ladder', 'hmi', 'scope', 'panel', 'drive')),
  seo_title text not null default '',
  seo_description text not null default '',
  intro text[] not null default '{}',
  specialties_title text not null default 'Ce que nous faisons',
  specialties text[] not null default '{}',
  sections jsonb not null default '[]'::jsonb,
  keywords text[] not null default '{}',
  request_type text not null default 'Autre',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Quote requests from the site's form (written by /api/quote with the secret key)
-- ---------------------------------------------------------------------------
create table if not exists public.quote_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  company text not null default '',
  phone text not null default '',
  email text not null default '',
  request_type text not null default '',
  equipment text not null default '',
  service text not null default '',
  message text not null,
  on_site boolean not null default false,
  status text not null default 'nouveau' check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  notes text not null default '',
  email_sent boolean not null default false
);
create index if not exists quote_requests_created_at on public.quote_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- 4b. Settings edited in /admin → Paramètres (one row each)
-- ---------------------------------------------------------------------------
-- Contact details shown on the site (public).
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  address text not null default '',
  map_url text not null default '',
  hours text not null default '',
  updated_at timestamptz not null default now()
);
-- Private: where quote requests are e-mailed (read by /api/quote with the secret key).
create table if not exists public.admin_settings (
  id smallint primary key default 1 check (id = 1),
  notify_emails text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Access rules. Existing policies on these tables are replaced.
-- ---------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('portfolio', 'portfolio_media', 'services', 'quote_requests', 'resume_links', 'site_admins', 'site_settings', 'admin_settings')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

alter table public.portfolio enable row level security;
alter table public.portfolio_media enable row level security;
alter table public.services enable row level security;
alter table public.quote_requests enable row level security;
alter table public.resume_links enable row level security;

-- Visitors read what is published; the admin reads and writes everything.
create policy "read published projects" on public.portfolio
  for select using (published or public.is_site_admin());
create policy "admin manages projects" on public.portfolio
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "read media of published projects" on public.portfolio_media
  for select using (exists (
    select 1 from public.portfolio p where p.id = portfolio_id and (p.published or public.is_site_admin())
  ));
create policy "admin manages media" on public.portfolio_media
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "read published services" on public.services
  for select using (published or public.is_site_admin());
create policy "admin manages services" on public.services
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

-- Quote requests are private: no access for visitors at all.
create policy "admin reads requests" on public.quote_requests
  for select to authenticated using (public.is_site_admin());
create policy "admin updates requests" on public.quote_requests
  for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admin deletes requests" on public.quote_requests
  for delete to authenticated using (public.is_site_admin());

create policy "read resume links" on public.resume_links for select using (true);
create policy "admin manages resume links" on public.resume_links
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

alter table public.site_settings enable row level security;
alter table public.admin_settings enable row level security;
create policy "read contact details" on public.site_settings for select using (true);
create policy "admin manages contact details" on public.site_settings
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admin manages private settings" on public.admin_settings
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant select, insert, update on public.admin_settings to authenticated;
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant select, update, delete on public.quote_requests to authenticated;
grant select on public.portfolio, public.portfolio_media, public.resume_links to anon, authenticated;
grant insert, update, delete on public.portfolio, public.portfolio_media, public.resume_links to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Photo uploads: public bucket "portfolio", only the admin can write
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio files: admin read" on storage.objects;
drop policy if exists "portfolio files: admin upload" on storage.objects;
drop policy if exists "portfolio files: admin update" on storage.objects;
drop policy if exists "portfolio files: admin delete" on storage.objects;
create policy "portfolio files: admin read" on storage.objects
  for select to authenticated using (bucket_id = 'portfolio' and public.is_site_admin());
create policy "portfolio files: admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and public.is_site_admin());
create policy "portfolio files: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio' and public.is_site_admin());
create policy "portfolio files: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and public.is_site_admin());

-- ---------------------------------------------------------------------------
-- 7. Service cards on the home page (photo + short line)
-- ---------------------------------------------------------------------------
alter table public.services add column if not exists tagline text not null default '';
alter table public.services add column if not exists image text not null default '';

-- The four "automation" pages from the previous version are replaced, unless they were edited in /admin.
delete from public.services
where (slug = 'control-automation' and summary = $q$Armoires de commande conçues sur mesure selon votre cahier des charges, et modernisation des installations existantes.$q$)
   or (slug = 'drives-commissioning' and summary = $q$Paramétrage, intégration et remplacement de variateurs de fréquence et de démarreurs progressifs, jusqu’aux essais de la machine.$q$)
   or (slug = 'plc-programming' and summary = $q$Création, modification et mise au point de programmes d’automates et d’écrans opérateur, de la machine simple à la ligne de production complète.$q$)
   or (slug = 'control-panel-diagnostics' and summary = $q$Machine à l’arrêt, défaut intermittent, automate en erreur : recherche méthodique de la panne dans l’armoire de commande et remise en production.$q$);

insert into public.services (slug, title, summary, tagline, image, sort_order) values
  ('plc-programming', $q$Programmation PLC et IHM$q$,
   $q$Création, modification et mise au point de programmes d’automates et d’écrans opérateur. Récupération de programmes perdus et migration d’automates obsolètes.$q$,
   $q$Siemens S7 · TIA Portal · Modicon · Omron · Fatek$q$, '/images/web/ihm.webp', 10),
  ('control-panel-diagnostics', $q$Dépannage d’armoires de commande$q$,
   $q$Machine à l’arrêt ou défaut intermittent : recherche méthodique de la panne dans l’armoire (automate, entrées/sorties, capteurs, relais) et remise en production.$q$,
   $q$Intervention sur site partout en Algérie$q$, '/images/web/automates.webp', 20),
  ('electrical-study', $q$Études électriques$q$,
   $q$Schémas électriques, bilan de puissance, choix des protections et des câbles, conception d’armoires de commande et rétrofit d’installations existantes.$q$,
   $q$Armoires · protections · rétrofit$q$, '/images/web/fondateur-site.webp', 30),
  ('drives-repair', $q$Variateurs de vitesse (VFD)$q$,
   $q$Diagnostic, réparation, paramétrage et remplacement de variateurs AC/DC et de démarreurs progressifs, de 0,37 kW à plus de 500 kW.$q$,
   $q$ABB · Schneider Altivar · Siemens · Danfoss · LS$q$, '/images/web/variateurs.webp', 40),
  ('electronic-repair', $q$Réparation de cartes électroniques$q$,
   $q$Réparation au niveau composant des cartes de commande et de puissance, rétro-ingénierie quand le schéma n’existe pas.$q$,
   $q$Cartes de commande et de puissance$q$, '/images/web/cartes.webp', 50),
  ('power-sensors', $q$Alimentations et capteurs$q$,
   $q$Alimentations AC/DC, onduleurs et stabilisateurs de tension ; diagnostic et remplacement de capteurs et de transmetteurs.$q$,
   $q$Alimentations · capteurs · instrumentation$q$, '/images/web/alimentations.webp', 60)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 7b. Current contact details and notification address (kept if already set)
-- ---------------------------------------------------------------------------
insert into public.site_settings (id, email, phone, whatsapp, address, map_url, hours)
values (1, 'moutiefekhar@gmail.com', '+213 778 46 16 82', '+213 778 46 16 82', 'Ain Dhab, Médéa 26011, Algérie',
        'https://maps.app.goo.gl/o5DLijMqhsTaiac19', 'Samedi – jeudi, 8 h – 17 h')
on conflict (id) do nothing;
insert into public.admin_settings (id, notify_emails) values (1, array['moutie225@gmail.com'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 8. Make your account the admin (create it first in Authentication → Users)
-- ---------------------------------------------------------------------------
insert into public.site_admins (user_id)
select id from auth.users where lower(email) = lower('moutie225@gmail.com')
on conflict do nothing;

select case when exists (select 1 from public.site_admins)
  then 'OK : compte administrateur prêt'
  else 'ATTENTION : créez d’abord le compte dans Authentication → Users, puis relancez ce script'
end as resultat;

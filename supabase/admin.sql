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
-- 5. Access rules. Existing policies on these tables are replaced.
-- ---------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('portfolio', 'portfolio_media', 'services', 'quote_requests', 'resume_links', 'site_admins')
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
-- 7. The four services as they are on the site today (kept if already present)
-- ---------------------------------------------------------------------------
insert into public.services
  (slug, title, summary, art, seo_title, seo_description, intro, specialties_title, specialties, sections, keywords, request_type, sort_order)
values
  ($q$plc-programming$q$, $q$Programmation PLC et IHM$q$, $q$Création, modification et mise au point de programmes d’automates et d’écrans opérateur, de la machine simple à la ligne de production complète.$q$, $q$hmi$q$, $q$Programmation d’automates PLC et d’écrans IHM en Algérie | MTE$q$, $q$Création et modification de programmes PLC et IHM, récupération de programmes perdus, migration d’automates obsolètes : Siemens, Schneider, Omron, Fatek. Intervention partout en Algérie.$q$,
   array[$q$L’automate pilote chaque séquence de votre machine ; l’écran IHM donne à l’opérateur les bonnes informations au bon moment. Un programme clair et structuré, c’est une machine plus fiable, plus sûre et plus rapide à dépanner.$q$, $q$Nous intervenons sur des programmes existants comme sur des projets neufs : modification d’un cycle, ajout d’une fonction, récupération d’un programme perdu ou automatisation complète d’une machine.$q$]::text[],
   $q$Ce que nous faisons$q$, array[$q$Création de programmes PLC et d’écrans IHM$q$, $q$Modification et optimisation de programmes existants$q$, $q$Sauvegarde et récupération de programmes perdus$q$, $q$Migration d’automates obsolètes vers une gamme actuelle$q$, $q$Communication entre automates, IHM, variateurs et capteurs$q$, $q$Mise en service et assistance sur site$q$]::text[],
   $q$[{"title":"Les plateformes","paragraphs":["Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider Electric (Modicon, Zelio), Omron et Fatek, ainsi que les écrans opérateur associés. Pour une autre marque, demandez-nous : nous vous répondons rapidement."]},{"title":"Programme perdu ou automate verrouillé","paragraphs":["Quand le programme d’origine n’est plus disponible, nous le récupérons lorsque c’est possible, ou le réécrivons à partir du fonctionnement de la machine. Vous recevez une sauvegarde commentée, pour ne plus dépendre d’une seule copie."]},{"title":"Tester avant d’intervenir","paragraphs":["Les séquences peuvent être validées en simulation avant d’être chargées dans la machine. Le temps d’arrêt de la production est réduit au strict nécessaire."]}]$q$::jsonb,
   array[$q$plc$q$, $q$automate$q$, $q$hmi$q$, $q$ihm$q$, $q$ktp$q$, $q$programmation$q$, $q$tia$q$, $q$factory io$q$, $q$et200$q$, $q$automatisme$q$]::text[], $q$Programmation PLC / IHM$q$, 10),
  ($q$control-panel-diagnostics$q$, $q$Diagnostic et dépannage d’armoires$q$, $q$Machine à l’arrêt, défaut intermittent, automate en erreur : recherche méthodique de la panne dans l’armoire de commande et remise en production.$q$, $q$scope$q$, $q$Dépannage d’armoires électriques et diagnostic de pannes machines en Algérie | MTE$q$, $q$Recherche de pannes sur armoires de commande et machines industrielles : défauts automate, entrées/sorties, capteurs, variateurs, communications. Intervention sur site partout en Algérie.$q$,
   array[$q$Une panne d’armoire peut venir d’un capteur, d’un câble, d’un relais, du programme ou de l’automate lui-même. Nous partons des symptômes, lisons l’état de l’automate et des entrées/sorties, et remontons jusqu’à la cause réelle, plutôt que de remplacer des pièces au hasard.$q$, $q$L’objectif : relancer la production rapidement, puis traiter la cause pour que la panne ne revienne pas.$q$]::text[],
   $q$Ce que nous vérifions$q$, array[$q$Défauts de l’automate et lecture du programme en ligne$q$, $q$Entrées/sorties, capteurs, fins de course et sécurités$q$, $q$Relais, contacteurs, protections et alimentations$q$, $q$Défauts de variateurs et de démarreurs$q$, $q$Communications entre automate, IHM et équipements$q$, $q$Pannes intermittentes et défauts récurrents$q$]::text[],
   $q$[{"title":"Sur site, partout en Algérie","paragraphs":["Nous venons avec le matériel de mesure et le logiciel adapté à votre automate. Un premier échange par téléphone ou WhatsApp (photos de l’armoire, code défaut affiché) permet souvent de préparer l’intervention avant le déplacement.","À la fin de l’intervention, vous recevez un bon d’intervention qui décrit la panne trouvée, ce qui a été fait et les recommandations éventuelles."]},{"title":"Et si une carte électronique est en cause ?","paragraphs":["Quand le défaut vient d’une carte (automate, variateur, alimentation), nous vous présentons les options : remplacement par un équivalent disponible, ou réparation lorsque c’est la solution la plus rapide pour relancer la machine."]}]$q$::jsonb,
   array[$q$diagnostic$q$, $q$dépannage$q$, $q$panne$q$, $q$défaut$q$, $q$remise en service$q$, $q$armoire$q$, $q$eeprom$q$]::text[], $q$Machine ou armoire en panne$q$, 20),
  ($q$control-automation$q$, $q$Conception et rétrofit d’armoires$q$, $q$Armoires de commande conçues sur mesure selon votre cahier des charges, et modernisation des installations existantes.$q$, $q$panel$q$, $q$Conception d’armoires de commande et rétrofit d’automatismes en Algérie | MTE$q$, $q$Étude, réalisation et mise en service d’armoires de commande sur mesure. Rétrofit d’automates et d’IHM obsolètes, intégration de variateurs et supervision. Médéa et toute l’Algérie.$q$,
   array[$q$Chaque machine a ses contraintes : cadence, sécurité, environnement, budget. Nous concevons des armoires de commande pensées pour votre installation, avec du matériel disponible en Algérie pour une maintenance simple dans la durée.$q$, $q$De l’étude jusqu’à la mise en service sur site, un seul interlocuteur suit le projet : les choix techniques sont expliqués et chaque étape est validée avec vous.$q$]::text[],
   $q$Nos prestations$q$, array[$q$Étude, schémas et choix du matériel$q$, $q$Réalisation et câblage d’armoires de commande$q$, $q$Rétrofit : remplacement d’automates et d’IHM obsolètes$q$, $q$Intégration de variateurs, démarreurs et sécurités$q$, $q$Supervision et remontée d’informations$q$, $q$Installation et mise en service sur site$q$]::text[],
   $q$[{"title":"Du cahier des charges à la mise en service","paragraphs":["Nous partons du fonctionnement attendu : entrées et sorties, sécurités, modes de marche, interface opérateur. L’armoire est câblée et testée avant l’installation, puis mise en service avec vos équipes."]},{"title":"Moderniser plutôt que remplacer","paragraphs":["Automate obsolète, pièces introuvables, pannes répétées : un rétrofit remplace la partie commande en conservant la mécanique de la machine. C’est souvent la solution la plus économique pour prolonger la vie d’une ligne de production."]}]$q$::jsonb,
   array[$q$rétrofit$q$, $q$retrofit$q$, $q$armoire$q$, $q$upgrade$q$, $q$modernisation$q$, $q$installation$q$, $q$scada$q$]::text[], $q$Nouvelle armoire / rétrofit$q$, 30),
  ($q$drives-commissioning$q$, $q$Variateurs et mise en service$q$, $q$Paramétrage, intégration et remplacement de variateurs de fréquence et de démarreurs progressifs, jusqu’aux essais de la machine.$q$, $q$drive$q$, $q$Paramétrage et mise en service de variateurs de fréquence en Algérie | MTE$q$, $q$Paramétrage et intégration de variateurs ABB, Schneider Altivar, Siemens, Danfoss, LS. Remplacement par un équivalent disponible, liaison avec l’automate, essais et mise en service.$q$,
   array[$q$Un variateur mal réglé use le moteur, se met en défaut ou limite la production. Nous paramétrons et intégrons vos variateurs : rampes, protections, régulation, commande par l’automate.$q$, $q$Quand un variateur est hors service ou introuvable, nous le remplaçons par un modèle disponible et reprenons le paramétrage pour que la machine fonctionne comme avant.$q$]::text[],
   $q$Nos interventions$q$, array[$q$Paramétrage de variateurs ABB, Schneider, Siemens, Danfoss, LS…$q$, $q$Remplacement par un équivalent disponible$q$, $q$Commande par l’automate, câblée ou en réseau$q$, $q$Démarreurs progressifs et commandes moteur$q$, $q$Analyse des défauts variateur$q$, $q$Essais et mise en service$q$]::text[],
   $q$[{"title":"Remplacer sans changer votre process","paragraphs":["Nous relevons les réglages de l’ancien variateur quand c’est possible, choisissons un modèle adapté au moteur et à l’application, puis reprenons le câblage et le paramétrage. La machine redémarre avec le même comportement."]},{"title":"Essais et réglages","paragraphs":["Chaque mise en service se termine par des essais en conditions réelles : sens de rotation, rampes, protections, sécurités. Les réglages importants sont notés pour vos futures interventions."]}]$q$::jsonb,
   array[$q$variateur$q$, $q$vfd$q$, $q$altivar$q$, $q$atv$q$, $q$acs$q$, $q$drive$q$, $q$démarreur$q$, $q$paramétrage$q$]::text[], $q$Variateur / mise en service$q$, 40)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 8. Make your account the admin (create it first in Authentication → Users)
-- ---------------------------------------------------------------------------
insert into public.site_admins (user_id)
select id from auth.users where lower(email) = lower('moutiefekhar@gmail.com')
on conflict do nothing;

select case when exists (select 1 from public.site_admins)
  then 'OK : compte administrateur prêt'
  else 'ATTENTION : créez d’abord le compte dans Authentication → Users, puis relancez ce script'
end as resultat;

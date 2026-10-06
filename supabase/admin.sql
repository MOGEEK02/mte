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
-- 9. English version of the site (/en)
-- ---------------------------------------------------------------------------
alter table public.services add column if not exists title_en text not null default '';
alter table public.services add column if not exists summary_en text not null default '';
alter table public.services add column if not exists tagline_en text not null default '';
alter table public.portfolio add column if not exists title_en text;
alter table public.portfolio add column if not exists description_en text;
alter table public.site_settings add column if not exists hours_en text not null default '';

update public.site_settings set hours_en = 'Saturday – Thursday, 8 am – 5 pm' where id = 1 and hours_en = '';

-- English texts of the six services (only where still empty).
update public.services s set title_en = v.t, summary_en = v.s, tagline_en = v.g
from (values
  ('plc-programming', $q$PLC and HMI programming$q$,
   $q$Writing, modifying and commissioning PLC and operator-panel programs. Recovery of lost programs and migration of obsolete PLCs.$q$,
   $q$Siemens S7 · TIA Portal · Modicon · Omron · Fatek$q$),
  ('control-panel-diagnostics', $q$Control panel troubleshooting$q$,
   $q$Machine down or intermittent fault: methodical fault finding in the panel (PLC, inputs/outputs, sensors, relays) and return to production.$q$,
   $q$On-site service across Algeria$q$),
  ('electrical-study', $q$Electrical design studies$q$,
   $q$Wiring diagrams, power balance, selection of protection devices and cables, control panel design and retrofit of existing installations.$q$,
   $q$Panels · protection · retrofit$q$),
  ('drives-repair', $q$Variable frequency drives (VFD)$q$,
   $q$Diagnosis, repair, parameter setup and replacement of AC/DC drives and soft starters, from 0.37 kW to over 500 kW.$q$,
   $q$ABB · Schneider Altivar · Siemens · Danfoss · LS$q$),
  ('electronic-repair', $q$Electronic board repair$q$,
   $q$Component-level repair of control and power boards, with reverse engineering when no schematic exists.$q$,
   $q$Control and power boards$q$),
  ('power-sensors', $q$Power supplies and sensors$q$,
   $q$AC/DC power supplies, UPS units and voltage stabilisers; diagnosis and replacement of sensors and transmitters.$q$,
   $q$Power supplies · sensors · instrumentation$q$)
) as v(slug, t, s, g)
where s.slug = v.slug and s.title_en = '';

-- English translations of the published projects (only where still empty; edit them in /admin).
update public.portfolio p set title_en = v.t, description_en = v.d
from (values
  (18, $q$PLC Programming — Industrial Vacuum System | Automation Algeria$q$,
   $q$Design and programming of an automated control system for an industrial vacuum installation with three motors: a main vacuum pump (11 kW) and two Roots blowers (7 kW and 5.5 kW), controlled by a Mitsubishi FX PLC.

The ladder program includes:

→ Automatic sequencing from pressure sensors
→ Two operating modes: Automatic and Manual
→ Phase-fault protection (thermal overload relay)
→ Temperature monitoring with an Omron E5CC controller
→ Control of a vacuum-break solenoid valve (fail-safe)
→ Start-up time delay for mechanical protection
→ Interlocking: the blowers cannot start without the main pump
→ Alarm reset with fault memory

Delivered by MTE Industrial Electronics — Algeria.
Specialist in industrial automation, PLC programming, variable frequency drives and component-level electronic maintenance.$q$),
  (17, $q$Repair and recommissioning of a 40 kVA generator set$q$,
   $q$Diagnosis and complete repair of a 40 kVA generator set. Work carried out: replacement of the main contactor, repair of the engine control module (generator display), repair of the battery charger, complete rewiring of the control panel with correction of the wiring diagram, repair of the fuel level sensor, coolant drain and replacement, diagnosis and repair of the diesel fuel circuit, recommissioning and load tests. Completed in 4 days — the fault had not been solved by previous technicians for more than a month.$q$),
  (1, $q$120 kW variable frequency drive repair$q$,
   $q$Repair of a 120 kW variable frequency drive.$q$),
  (4, $q$ABB ACS150 drive installation | Replacing a SEW drive$q$,
   $q$Successful installation of an ABB ACS150 variable frequency drive in a water bottling unit. An old, out-of-service SEW drive was replaced with an ABB ACS150-03E-08A8-4 (1.5 kW / 2 HP). The existing braking resistor was reused, and the drive was commissioned for reliable, optimised operation.$q$),
  (3, $q$LS variable frequency drive (VFD) repair | Plastic injection machine for shoe soles$q$,
   $q$Complete intervention (diagnosis, repair and testing) on the LS variable frequency drives of a plastic injection machine for shoe soles. Replacement of the three-phase rectifier bridge, IGBT module (braking chopper), capacitors and a Semikron SKDH 146/16-L75 module. Recommissioned with optimised performance and industrial reliability.

#VFDRepair #VariableFrequencyDrive #LSVFD #IndustrialMaintenance #InjectionMolding #IGBT #Semikron #AlgeriaIndustry$q$),
  (7, $q$Industrial ultrasonic cutting machine repair$q$,
   $q$Diagnosis, repair and testing of an ultrasonic cutting machine. Work on the electronic components (generator, transducer, power board) and adjustment of the operating parameters. Recommissioned with stable performance and precise cutting.

#Ultrasonic #IndustrialMaintenance #Electronics #Diagnosis #Repair$q$),
  (9, $q$Restoration and overhaul: Andeli 30 kVA voltage stabiliser (3-phase)$q$,
   $q$Complete overhaul of an Andeli 30 kVA three-phase voltage stabiliser. In-depth diagnosis and full renovation, including replacement of the servo motors and calibration of the regulation circuits. From worn condition back to as-new condition, for high-performance electrical protection and optimal voltage stability.

#IndustrialMaintenance #Algeria #Andeli #VoltageStabilizer #PowerSolutions$q$),
  (13, $q$Installation and setup of a Schneider Altivar Process ATV930 drive$q$,
   $q$Commissioning of a Schneider Electric ATV930 industrial variable speed drive (22 kW / 30 HP). On-site integration including control wiring, configuration of the acceleration ramps and motor energy optimisation. A high-performance solution for industrial pumping or ventilation control in Algeria.

#SchneiderElectric #Altivar #ATV930 #VFD #AutomationAlgeria #IndustrialMaintenance$q$),
  (11, $q$Siemens ET200 & KTP1200 automation upgrade – Algiers Metro$q$,
   $q$Optimisation of a railway control system. Development in TIA Portal for a Siemens ET200 PLC and a KTP1200 HMI. Integration of advanced diagnostic functions and real-time monitoring of the CPU states (RUN/STOP) for better preventive maintenance of the network.$q$),
  (14, $q$VFD configuration and control panel repair | JH21-45T pneumatic press$q$,
   $q$Intervention on a JH21-45T pneumatic press used for sheet-metal punching. Configuration of the variable frequency drive (VFD) and repair of the control panel to ensure reliable, stable operation of the machine.$q$),
  (8, $q$Reverse engineering & PCB repair: treadmill power board$q$,
   $q$Advanced microelectronics work on the test bench. Complex diagnosis through reverse engineering to identify and replace burnt power components on a treadmill controller. Careful restoration of the printed circuit board (PCB), bringing it back into service without the costly replacement of the complete board.

#ReverseEngineering #PCBRepair #Microelectronics #PowerElectronics #ElectronicMaintenance$q$)
) as v(id, t, d)
where p.id = v.id and coalesce(p.title_en, '') = '';

-- Projects 15 and 16 were written in English: that text becomes the English version and a French
-- version is added (only if they have not been edited since).
update public.portfolio set
  title_en = trim(title),
  description_en = description,
  title = $q$Rétrofit complet automate et IHM sur une ligne de production de carton Hebei Huayu$q$,
  description = $q$Une ligne de production de carton est arrivée avec une panne catastrophique : un court-circuit entre le 24 V DC et une phase 230 V AC avait détruit la plupart des composants électriques et électroniques de la machine. Rien n’avait été épargné.
L’intervention a couvert l’ensemble des dégâts :

🔍 Diagnostic de la cause : suivi du chemin du court-circuit dans l’armoire et identification de chaque composant endommagé
⚡ Réparation des variateurs : réparation au niveau composant des variateurs de fréquence endommagés
🔧 Installation et mise en service de variateurs : pose des variateurs de remplacement et programmation de tous les paramètres (accélération, décélération, limites de fréquence, mode de commande)
🖥️ Réparation de l’IHM : diagnostic et réparation de l’interface homme-machine endommagée
🧠 Nouvel automate : remplacement de l’automate défaillant par un Schneider Electric Modicon TM221 et réécriture complète du programme en ladder
🔌 Recâblage complet : dépose et reprise de tout le câblage de l’armoire selon les règles de l’art industrielles

La machine est passée d’un arrêt total à la remise en production — sans documentation d’origine, sans sauvegarde du programme, en repartant de zéro.$q$
where id = 16 and trim(title) = 'Full PLC & HMI Retrofit on a Hebei Huayu Carton Production Line' and coalesce(title_en, '') = '';

update public.portfolio set
  title_en = trim(title),
  description_en = description,
  title = $q$Diagnostic et reprogrammation d’une EEPROM corrompue sur un variateur Honeywell (HONVFD05P5K)$q$,
  description = $q$Réparation d’un variateur de fréquence haute performance Honeywell HONVFD05P5K qui affichait un défaut permanent.

Un diagnostic méthodique a permis d’identifier la cause : une mémoire EEPROM M24C64 corrompue.
La mémoire a été extraite, son contenu analysé, puis reprogrammée avec un fichier binaire (BIN) valide.

Après remontage de l’EEPROM, le variateur a retrouvé un fonctionnement normal, confirmant la résolution complète du défaut.

Ce projet illustre :

Le diagnostic de pannes au niveau matériel et firmware
La manipulation et la reprogrammation d’EEPROM
L’utilisation de programmateurs externes et la récupération de données binaires
La réparation concrète d’équipements de contrôle industriels

Pour obtenir le fichier BIN ou pour un problème similaire, contactez-nous sur WhatsApp.$q$
where id = 15 and trim(title) = 'Diagnosing and Reprogramming Corrupted EEPROM in Honeywell VFD (HONVFD05P5K)' and coalesce(title_en, '') = '';

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

-- MTE website: visitor statistics for /admin → Tableau de bord.
-- Run in Supabase → SQL Editor for the WEBSITE project, after admin.sql. Safe to run again.
--
-- Adds to each visit (written by /api/track): the approximate wilaya/region and city from Vercel's
-- geolocation, the browser and system, the page number in the visit and whether the browser had
-- already visited the site. Still no cookie, no IP address and no visitor identifier.

alter table public.site_events add column if not exists region text not null default '';
alter table public.site_events add column if not exists city text not null default '';
alter table public.site_events add column if not exists browser text not null default '';
alter table public.site_events add column if not exists os text not null default '';
-- Page number in the visit (1 = first page); for a contact, the pages seen before it. Empty for
-- events saved before this script.
alter table public.site_events add column if not exists page_no smallint;
-- First page of a visit: had this browser visited the site before?
alter table public.site_events add column if not exists return_visit boolean;

-- Figures for /admin → Tableau de bord over the last `days` days (Algeria time), admin only.
create or replace function public.site_stats(days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  n integer := least(greatest(coalesce(days, 30), 1), 366);
  first_day date := (now() at time zone 'Africa/Algiers')::date - (n - 1);
  since timestamptz := first_day::timestamp at time zone 'Africa/Algiers';
  result jsonb;
begin
  if not public.is_site_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  with ev as (
    select * from public.site_events where created_at >= since
  ),
  visits as (
    select * from ev where type = 'view' and entry
  ),
  per_day as (
    select (created_at at time zone 'Africa/Algiers')::date as day,
           count(*) filter (where type = 'view') as views,
           count(*) filter (where type = 'view' and entry) as visits,
           count(*) filter (where type <> 'view') as contacts
    from ev
    group by 1
  )
  select jsonb_build_object(
    'from', first_day,
    'daily', (
      select jsonb_agg(jsonb_build_object(
               'day', to_char(d, 'YYYY-MM-DD'),
               'views', coalesce(p.views, 0),
               'visits', coalesce(p.visits, 0),
               'contacts', coalesce(p.contacts, 0)) order by d)
      from generate_series(first_day::timestamp, (first_day + (n - 1))::timestamp, interval '1 day') as d
      left join per_day p on p.day = d::date
    ),
    'totals', (
      select jsonb_build_object(
        'views', count(*) filter (where type = 'view'),
        'visits', count(*) filter (where type = 'view' and entry),
        'whatsapp', count(*) filter (where type = 'whatsapp'),
        'call', count(*) filter (where type = 'call'),
        'email', count(*) filter (where type = 'email'),
        'quote', count(*) filter (where type = 'quote'))
      from ev
    ),
    'pages', (
      select coalesce(jsonb_agg(jsonb_build_object('key', path, 'count', c) order by c desc, path), '[]'::jsonb)
      from (select path, count(*) as c from ev where type = 'view' group by path order by c desc, path limit 10) t
    ),
    'referrers', (
      select coalesce(jsonb_agg(jsonb_build_object('key', referrer, 'count', c) order by c desc, referrer), '[]'::jsonb)
      from (select referrer, count(*) as c from visits group by referrer order by c desc, referrer limit 10) t
    ),
    'countries', (
      select coalesce(jsonb_agg(jsonb_build_object('key', country, 'count', c) order by c desc, country), '[]'::jsonb)
      from (select country, count(*) as c from visits group by country order by c desc, country limit 10) t
    ),
    'devices', (
      select coalesce(jsonb_agg(jsonb_build_object('key', device, 'count', c) order by c desc, device), '[]'::jsonb)
      from (select device, count(*) as c from visits group by device) t
    ),
    'langs', (
      select coalesce(jsonb_agg(jsonb_build_object('key', lang, 'count', c) order by c desc, lang), '[]'::jsonb)
      from (select lang, count(*) as c from ev where type = 'view' group by lang) t
    ),
    'contactPages', (
      select coalesce(jsonb_agg(jsonb_build_object('key', path, 'count', c) order by c desc, path), '[]'::jsonb)
      from (select path, count(*) as c from ev where type <> 'view' group by path order by c desc, path limit 5) t
    ),

    -- Added by this script (only visits saved since, where page_no is set).
    'visitors', (
      select jsonb_build_object(
        'visits', (select count(*) from visits where page_no is not null),
        'returning', (select count(*) from visits where page_no is not null and return_visit),
        'views', (select count(*) from ev where type = 'view' and page_no is not null),
        'deeper', (select count(*) from ev where type = 'view' and page_no = 2),
        'live', (select count(*) from public.site_events where type = 'view' and created_at >= now() - interval '15 minutes')
      )
    ),
    'regions', (
      select coalesce(jsonb_agg(jsonb_build_object('key', region, 'count', c) order by c desc, region), '[]'::jsonb)
      from (select region, count(*) as c from visits where region <> '' group by region order by c desc, region limit 12) t
    ),
    'cities', (
      select coalesce(jsonb_agg(jsonb_build_object('key', city, 'count', c) order by c desc, city), '[]'::jsonb)
      from (select city, count(*) as c from visits where city <> '' group by city order by c desc, city limit 12) t
    ),
    'browsers', (
      select coalesce(jsonb_agg(jsonb_build_object('key', browser, 'count', c) order by c desc, browser), '[]'::jsonb)
      from (select browser, count(*) as c from visits where browser <> '' group by browser order by c desc, browser limit 8) t
    ),
    'systems', (
      select coalesce(jsonb_agg(jsonb_build_object('key', os, 'count', c) order by c desc, os), '[]'::jsonb)
      from (select os, count(*) as c from visits where os <> '' group by os order by c desc, os limit 8) t
    ),
    'landing', (
      select coalesce(jsonb_agg(jsonb_build_object('key', path, 'count', c) order by c desc, path), '[]'::jsonb)
      from (select path, count(*) as c from visits group by path order by c desc, path limit 10) t
    ),
    -- Visits by hour (0–23) and by weekday (0 = Monday … 6 = Sunday), Algeria time.
    'hours', (
      select jsonb_agg(coalesce(c, 0) order by h)
      from generate_series(0, 23) as h
      left join (select extract(hour from created_at at time zone 'Africa/Algiers')::int as hr, count(*) as c from visits group by 1) t on t.hr = h
    ),
    'weekdays', (
      select jsonb_agg(coalesce(c, 0) order by d)
      from generate_series(0, 6) as d
      left join (select extract(isodow from created_at at time zone 'Africa/Algiers')::int - 1 as wd, count(*) as c from visits group by 1) t on t.wd = d
    ),
    -- Visits and contacts per source (contacts saved since this script carry their visit's source).
    'sources', (
      select coalesce(jsonb_agg(jsonb_build_object('key', referrer, 'visits', v, 'contacts', c) order by v desc, c desc, referrer), '[]'::jsonb)
      from (
        select referrer,
               count(*) filter (where type = 'view') as v,
               count(*) filter (where type <> 'view') as c
        from ev
        where (type = 'view' and entry and page_no is not null) or (type <> 'view' and page_no is not null)
        group by referrer
        order by 2 desc, 3 desc, referrer
        limit 10
      ) t
    ),
    -- The latest visits (first page of each).
    'recent', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'at', created_at, 'path', path, 'referrer', referrer, 'device', device, 'browser', browser,
               'os', os, 'country', country, 'region', region, 'city', city, 'returning', return_visit)
             order by created_at desc), '[]'::jsonb)
      from (select * from visits order by created_at desc limit 25) t
    )
  ) into result;
  return result;
end;
$$;
revoke all on function public.site_stats(integer) from public;
grant execute on function public.site_stats(integer) to authenticated;

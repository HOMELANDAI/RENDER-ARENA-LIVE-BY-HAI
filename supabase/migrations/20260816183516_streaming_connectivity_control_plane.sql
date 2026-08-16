-- Render Arena Live by HAI streaming connectivity control plane
-- Applied to Supabase project ref: vbzkwuvdnnlznvhtqttl

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.streaming_platforms (
  platform_id text primary key,
  display_name text not null,
  platform_role text not null check (platform_role in ('primary_live','secondary_live','premium_live','distribution_hub','local_encoder')),
  connection_type text not null check (connection_type in ('direct_encoder','distribution_hub','embed_or_rtmp','local_encoder')),
  priority integer not null default 100,
  is_primary boolean not null default false,
  is_enabled boolean not null default true,
  public_url text,
  docs_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stream_destinations (
  id uuid primary key default gen_random_uuid(),
  platform_id text not null references public.streaming_platforms(platform_id) on delete cascade,
  destination_key text not null unique,
  display_name text not null,
  route_purpose text not null check (route_purpose in ('primary','secondary','premium','distribution','local_encoder','embed','fallback')),
  connection_method text not null check (connection_method in ('direct_rtmp','streamlabs_local','restream_hub','youtube_rtmp','maestro_rtmp','maestro_embed')),
  rtmp_url_placeholder text,
  stream_key_secret_name text,
  external_dashboard_url text,
  requires_manual_key boolean not null default true,
  is_enabled boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stream_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  show_name text not null default 'Render Arena Live by HAI',
  stream_mode text not null default 'streamlabs_to_twitch' check (stream_mode in ('streamlabs_to_twitch','streamlabs_to_restream','direct_youtube','maestro_premium','test_recording')),
  status text not null default 'draft' check (status in ('draft','scheduled','live','ended','cancelled')),
  primary_destination_id uuid references public.stream_destinations(id) on delete set null,
  scheduled_for timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  obs_scene text,
  figma_route text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stream_session_routes (
  id uuid primary key default gen_random_uuid(),
  stream_session_id uuid not null references public.stream_sessions(id) on delete cascade,
  destination_id uuid not null references public.stream_destinations(id) on delete cascade,
  route_order integer not null default 1,
  route_role text not null check (route_role in ('primary','secondary','mirror','premium_embed','fallback','control')),
  route_status text not null default 'planned' check (route_status in ('planned','ready','live','paused','ended','failed')),
  is_required boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stream_session_id, destination_id)
);

create table if not exists public.stream_events (
  id uuid primary key default gen_random_uuid(),
  stream_session_id uuid references public.stream_sessions(id) on delete cascade,
  event_type text not null,
  event_source text not null default 'render_arena_app',
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Seeded route metadata. Stream keys are not stored here.
insert into public.streaming_platforms (platform_id, display_name, platform_role, connection_type, priority, is_primary, public_url, docs_url, notes) values
('twitch','Twitch','primary_live','direct_encoder',10,true,'https://www.twitch.tv/','https://help.twitch.tv/','Primary Render Arena live destination.'),
('youtube','YouTube Live','secondary_live','direct_encoder',20,false,'https://www.youtube.com/','https://support.google.com/youtube/','Secondary live and evergreen platform.'),
('maestro','Maestro TV','premium_live','embed_or_rtmp',30,false,'https://www.maestro.io/','https://support.maestro.io/','Premium interactive broadcast layer.'),
('restream','Restream','distribution_hub','distribution_hub',40,false,'https://restream.io/','https://support.restream.io/','Optional multistream router.'),
('streamlabs','Streamlabs Desktop','local_encoder','local_encoder',1,false,'https://streamlabs.com/','https://support.streamlabs.com/','Local encoding/control surface.')
on conflict (platform_id) do update set updated_at = now();

insert into public.stream_destinations (destination_key, platform_id, display_name, route_purpose, connection_method, stream_key_secret_name, external_dashboard_url, requires_manual_key, notes) values
('streamlabs_local_encoder','streamlabs','Streamlabs Local Encoder','local_encoder','streamlabs_local',null,'https://streamlabs.com/dashboard',false,'Local scene/audio/encoder control.'),
('twitch_primary_direct','twitch','Twitch Primary Direct','primary','direct_rtmp','TWITCH_STREAM_KEY','https://dashboard.twitch.tv/',true,'Primary no-cost launch route.'),
('restream_distribution_hub','restream','Restream Distribution Hub','distribution','restream_hub','RESTREAM_STREAM_KEY','https://app.restream.io/',true,'Optional multistream hub.'),
('youtube_secondary_live','youtube','YouTube Live Secondary','secondary','youtube_rtmp','YOUTUBE_STREAM_KEY','https://studio.youtube.com/',true,'Secondary destination.'),
('maestro_premium_live','maestro','Maestro Premium Live Page','premium','maestro_rtmp','MAESTRO_STREAM_KEY','https://support.maestro.io/',true,'Premium RTMP destination.'),
('maestro_embed_page','maestro','Maestro Embedded Experience','embed','maestro_embed',null,'https://support.maestro.io/',false,'Website embed route.')
on conflict (destination_key) do update set updated_at = now();

create or replace view public.active_streaming_destinations with (security_invoker = true) as
select d.destination_key, d.display_name as destination_name, d.route_purpose, d.connection_method, d.rtmp_url_placeholder,
       d.stream_key_secret_name, d.requires_manual_key, d.is_enabled as destination_enabled,
       p.platform_id, p.display_name as platform_name, p.platform_role, p.connection_type, p.priority,
       p.is_primary, p.is_enabled as platform_enabled, p.public_url, p.docs_url, d.notes
from public.stream_destinations d
join public.streaming_platforms p on p.platform_id = d.platform_id
where d.is_enabled = true and p.is_enabled = true
order by p.priority, d.route_purpose;

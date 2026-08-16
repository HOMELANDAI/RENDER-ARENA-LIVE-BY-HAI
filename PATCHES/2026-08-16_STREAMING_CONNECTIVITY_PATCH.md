# Patch: Render Arena Live Streaming Connectivity

Date: 2026-08-16
Project: Render Arena Live by HAI
Supabase project: RENDER ARENA LIVE BY HAI
Supabase ref: vbzkwuvdnnlznvhtqttl

## Purpose

Add the connection layer required for Render Arena Live to stream primarily to Twitch, secondarily to YouTube, with optional Maestro TV premium presentation and Restream distribution. Streamlabs Desktop remains the simplest local encoder/control surface.

## Architecture rule

Supabase is the control plane, not the video relay. Supabase stores sessions, platform routes, stream status, destinations, events, panel metadata, and frontend state. The live video still moves through Streamlabs, Twitch, YouTube, Restream, or Maestro RTMP/embed workflows.

## Figma / web patch locations

### Location 1: `/live` Live Arena

Add a `Go Live Connections` strip above or beside the Arena Floor HUD.

Required UI:

- Primary route card: Streamlabs -> Twitch
- Secondary route card: Streamlabs -> Restream -> Twitch + YouTube
- Premium route card: Maestro Live / Maestro Embed
- Status chips: Draft, Scheduled, Ready, Live, Ended
- Launch buttons for Streamlabs, Twitch Dashboard, YouTube Studio, Restream Dashboard, Maestro Setup
- Supabase status indicator: Connected / Not Connected

### Location 2: `/platforms` or `/settings/streaming`

Add a `Stream Control Drawer` backend settings panel.

Required UI:

- select stream mode
- choose route destination keys
- create stream session
- mark session scheduled/live/ended
- view active destinations from Supabase
- show warning that stream keys are never stored or displayed in frontend code

## MVP route

```text
Streamlabs Desktop -> Twitch
Supabase -> stream session metadata, routes, status, events
Render Arena website/Figma -> reads route metadata from Supabase
```

## Multistream route

```text
Streamlabs Desktop -> Restream -> Twitch + YouTube
Supabase -> stream mode: streamlabs_to_restream
```

## Maestro route

```text
Streamlabs/Desktop Encoder -> Maestro RTMP destination
or
Render Arena website -> Maestro iFrame/embed module
Supabase -> session metadata + route state
```

## Backend objects added

Tables:

- streaming_platforms
- stream_destinations
- stream_sessions
- stream_session_routes
- stream_events

View:

- active_streaming_destinations

Storage bucket:

- render-arena-stream-assets

Edge Function:

- stream-session-control

Seeded destination keys:

- streamlabs_local_encoder
- twitch_primary_direct
- youtube_secondary_live
- restream_distribution_hub
- maestro_premium_live
- maestro_embed_page

## Key security rule

Never store Twitch, YouTube, Maestro, or Restream stream keys in frontend code. Database rows store only secret-name references such as `TWITCH_STREAM_KEY`, not the secret values.

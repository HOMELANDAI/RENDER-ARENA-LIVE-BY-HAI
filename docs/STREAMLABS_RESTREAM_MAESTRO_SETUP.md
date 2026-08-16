# Streamlabs / Restream / Maestro Setup

## Phase 1: Twitch primary

Use this first.

```text
Streamlabs Desktop -> Twitch
```

Recommended for the first test streams because it avoids multistream complexity.

## Phase 2: Restream optional

Use this when Twitch flow feels stable.

```text
Streamlabs Desktop -> Restream -> Twitch + YouTube
```

Restream becomes the distribution hub. Supabase records the session as `streamlabs_to_restream`.

## Phase 3: Maestro premium

Use Maestro for premium page presentation, structured polling, curated modules, gated replays, or embedded video/panels.

Possible routes:

```text
Encoder -> Maestro RTMP
Render Arena site -> Maestro embed
```

## Key warning

Do not put stream keys into Figma, frontend code, GitHub, or public Supabase tables. Keys stay in platform dashboards or Supabase Edge Function secrets only if a later server-side workflow truly requires them.

## First 6 test streams

For the first six streams, use:

```text
Streamlabs Desktop -> Twitch
Supabase stream_mode = streamlabs_to_twitch
```

The goal is to test show rhythm, not platform complexity.

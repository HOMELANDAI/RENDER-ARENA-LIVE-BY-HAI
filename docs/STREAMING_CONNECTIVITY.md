# Streaming Connectivity

Render Arena Live should start simple, then expand.

## Recommended free-first path

```text
Streamlabs Desktop -> Twitch
```

This is the cleanest way to begin logging hours on Twitch without adding unnecessary platform complexity.

## Secondary expansion path

```text
Streamlabs Desktop -> Restream -> Twitch + YouTube
```

Use this only after the Twitch-only show flow feels stable.

## YouTube path

YouTube Live can receive a stream from an encoder using a server URL and stream key. Render Arena should treat YouTube as both a secondary live destination and the main long-form replay/search archive.

## Maestro TV path

Maestro should be the premium interactive layer. It can host a live page, accept third-party encoder feeds, or be embedded into a Render Arena website module depending on the final Maestro setup.

## Supabase role

Supabase handles:

- stream session records
- active route metadata
- platform destinations
- live/scheduled/ended state
- event logging
- frontend control state
- storage of stream overlay assets

Supabase does not push the live video feed. The encoder and streaming services do that.

## Initial destination priority

1. Streamlabs local encoder
2. Twitch primary direct
3. YouTube secondary
4. Maestro embed or RTMP
5. Restream distribution hub

## Operational principle

Launch Twitch-first. Keep Restream, YouTube, and Maestro ready as connection modes, not mandatory dependencies for early streams.

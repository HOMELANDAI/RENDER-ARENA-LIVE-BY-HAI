# Streaming Connectivity

Render Arena Live by HAI should launch with the simplest working broadcast path first, then layer in multistream and premium destinations.

## Primary path

```text
Streamlabs Desktop -> Twitch
```

This is the preferred first-path because it minimizes friction while the show format is still being refined.

## Secondary path

```text
Streamlabs Desktop -> Restream -> Twitch + YouTube
```

This path allows Twitch to remain the primary home while YouTube can receive either live simulcast tests or later edited/replay content.

## Premium path

```text
Streamlabs / Encoder -> Maestro RTMP
Render Arena website -> Maestro embed / panel module
```

Maestro should be treated as a premium interactive layer for structured voting, gated replays, curated modules, and high-value audience experiences.

## Supabase role

Supabase controls:

- stream destination metadata
- session creation
- selected routing mode
- live/scheduled/ended status
- route status events
- realtime state for UI panels
- storage for stream assets and overlays

Supabase does not carry live video.

## Initial operating recommendation

Start with Streamlabs to Twitch direct, record locally, and cut YouTube content afterward. Add Restream only when the live show rhythm is stable.

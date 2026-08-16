# Supabase Streaming Backend

## Project

- Supabase project name: RENDER ARENA LIVE BY HAI
- Project ref: `vbzkwuvdnnlznvhtqttl`
- Project URL: `https://vbzkwuvdnnlznvhtqttl.supabase.co`

## Applied migrations

- `streaming_connectivity_control_plane`
- `harden_streaming_control_plane_security`
- `optimize_streaming_control_plane_indexes_and_policies`

## Tables

### streaming_platforms

Stores supported platforms: Twitch, YouTube, Maestro, Restream, and Streamlabs.

### stream_destinations

Stores destination routes and connection methods. It stores secret names, not stream keys.

### stream_sessions

Stores each live episode/test stream and its mode: Twitch direct, Restream multistream, Maestro premium, direct YouTube, or test recording.

### stream_session_routes

Connects a stream session to one or more destination routes.

### stream_events

Logs lifecycle events such as session created, scheduled, live, ended, route failed, render reveal, or host-triggered state changes.

## View

### active_streaming_destinations

Read model for frontend panels that need platform/destination cards.

## Edge Function

### stream-session-control

JWT-protected function for:

- fetching active destinations
- creating stream sessions
- setting stream status
- logging stream events

Endpoint:

```text
https://vbzkwuvdnnlznvhtqttl.supabase.co/functions/v1/stream-session-control
```

## Storage

Bucket:

```text
render-arena-stream-assets
```

Use for stream overlays, lower thirds, thumbnail exports, route screenshots, schedule cards, and platform-specific media cards.

## Security posture

- JWT verification is enabled on the Edge Function.
- RLS is enabled on new public tables.
- Stream keys are not stored in public rows.
- Destination records only name expected secret references such as `TWITCH_STREAM_KEY`.

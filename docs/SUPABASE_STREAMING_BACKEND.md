# Supabase Streaming Backend

Project: RENDER ARENA LIVE BY HAI
Project ref: vbzkwuvdnnlznvhtqttl
URL: https://vbzkwuvdnnlznvhtqttl.supabase.co

## Applied migrations

- streaming_connectivity_control_plane
- harden_streaming_control_plane_security
- optimize_streaming_control_plane_indexes_and_policies

## Tables

### streaming_platforms

Stores platform-level metadata for Twitch, YouTube, Maestro, Restream, and Streamlabs.

### stream_destinations

Stores route-specific destination metadata. This table stores dashboard URLs and secret-name references only, not stream keys.

### stream_sessions

Stores scheduled/live/ended sessions, selected mode, route, Figma page, OBS scene, and notes.

### stream_session_routes

Connects each session to one or more destinations.

### stream_events

Append-only live events for session_created, session_live, session_ended, and UI actions.

## Edge Function

`stream-session-control`

Supported actions:

- GET destinations
- GET session by id
- POST create_session
- POST set_status
- POST log_event

JWT verification is enabled.

## Realtime

The following tables were added to Supabase Realtime publication:

- stream_sessions
- stream_session_routes
- stream_events

## Storage

Bucket:

- render-arena-stream-assets

Purpose:

- overlay images
- JSON panel config
- stream thumbnails
- replay support assets

## Security

- RLS enabled on streaming tables.
- Public read allowed only for non-secret route metadata.
- Authenticated users can create/update stream sessions and routes.
- Stream keys stay in platform dashboards or Supabase secrets, not in public rows.

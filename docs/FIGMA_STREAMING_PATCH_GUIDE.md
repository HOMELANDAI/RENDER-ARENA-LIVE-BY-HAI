# Figma Streaming Patch Guide

Use this as the implementation instruction for the Render Arena Live Figma / Figma Make project.

## Patch 1: Live Arena Go-Live Connections

Target route/page:

```text
/live
```

Add a premium maroon/navy/gold connection module titled:

```text
Go Live Connections
```

### Cards

1. Streamlabs -> Twitch
   - Badge: Primary
   - Status: Ready / Needs Key / Live
   - Button: Open Twitch Dashboard

2. Streamlabs -> Restream -> Twitch + YouTube
   - Badge: Multistream Optional
   - Status: Available / Configure Restream
   - Button: Open Restream Dashboard

3. Maestro Premium Live
   - Badge: Premium
   - Status: RTMP or Embed
   - Button: Open Maestro Setup

4. Supabase Control Plane
   - Badge: Backend
   - Status: Connected
   - Shows project ref: vbzkwuvdnnlznvhtqttl

### Live Arena data binding

Read destinations from:

```text
GET /functions/v1/stream-session-control
```

Display:

- destination_name
- platform_name
- route_purpose
- connection_method
- requires_manual_key

## Patch 2: Streaming Settings Drawer

Target route/page:

```text
/platforms
or
/settings/streaming
```

Add a collapsible drawer titled:

```text
Stream Control Drawer
```

### Controls

- Stream title
- Stream mode selector
- Destination checklist
- Create session button
- Mark Scheduled
- Mark Live
- Mark Ended
- Log test event

### Stream modes

- streamlabs_to_twitch
- streamlabs_to_restream
- direct_youtube
- maestro_premium
- test_recording

### Default Twitch-first mode

Default destination keys:

```text
streamlabs_local_encoder
twitch_primary_direct
```

### Optional multistream mode

Destination keys:

```text
streamlabs_local_encoder
restream_distribution_hub
twitch_primary_direct
youtube_secondary_live
```

### Maestro mode

Destination keys:

```text
streamlabs_local_encoder
maestro_premium_live
maestro_embed_page
```

## Design

Use:

- deep maroon background
- navy metallic panels
- old gold trim
- render-teal status lights
- violet secondary glow

The panel should feel like a broadcast command bridge, not a generic settings menu.

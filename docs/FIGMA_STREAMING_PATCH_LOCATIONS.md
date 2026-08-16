# Figma Streaming Patch Locations

These are the two required Figma / web locations for the streaming update.

## Location A: Live Arena page

Route: `/live`

Add: `GoLiveConnectionsPanel`

### Placement

Place it near the Arena Floor HUD, preferably above the render battle interface or as a right-side utility rail.

### Cards

1. Streamlabs -> Twitch
2. Streamlabs -> Restream -> Twitch + YouTube
3. Maestro Premium Live / Embed

### State display

- Supabase connected
- selected stream mode
- session status
- active route
- latest event

## Location B: Platforms / Settings page

Route: `/platforms` or `/settings/streaming`

Add: `StreamControlDrawer`

### Controls

- create stream session
- choose stream mode
- select destinations
- set status: scheduled/live/ended
- open platform dashboards
- view Supabase route metadata

## Visual style

Use Render Arena palette:

- deep maroon base
- navy metallic cards
- old gold borders/buttons
- render-teal active status
- amber warning states

## Mandatory copy

"Supabase controls metadata and live state. Stream keys remain inside Streamlabs, Twitch, YouTube, Restream, Maestro, or private Supabase secrets."

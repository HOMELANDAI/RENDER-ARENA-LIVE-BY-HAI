# UI Spec: Colorway Prompt Engine

## Purpose

The Colorway Prompt Engine is the pre-round setup screen. It is half gallery, half terminal.

## Left panel

HAI Colorway Selector with stacked cards:

- Carbon Slice Supreme
- HAI Jacq Supreme
- Sage Variant
- Vice Edition

Each card includes:

- 28x28 color block
- colorway name
- description
- DNA notes
- active state

## Right panel

Terminal-style prompt builder with flags:

```text
--colorway
--style
--palette
--mood
--constraint
--camera
--lighting
--environment
--render_quality
```

## Live scoring

Colorway DNA Alignment meter scores prompt coherence in real time.

## Actions

- Lock Prompt
- Send to Firestore
- Queue Render

## Bottom system strip

NVIDIA RTX GPU Load bar fills from green through teal to heat-orange.

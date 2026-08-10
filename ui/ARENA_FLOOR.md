# UI Spec: Arena Floor

## Purpose

The Arena Floor is the main head-to-head render battle screen.

## Layout

- Split screen with left and right artist panels
- Vertical electric VS divider
- HAI logo header
- artist handles
- assigned colorway constraints
- live render canvas per side
- render progress bars
- vote counts
- percentage split bar
- final reveal pulse

## Data sources

- Firebase Realtime Database for vote counts
- Firestore for locked prompt metadata
- render queue status

## Visual style

Near-black base, render-teal, electric blue, violet, old gold pulse accents.

## User goal

Immediately understand who is rendering, what the constraint is, how far the render has progressed, and who is winning the vote.

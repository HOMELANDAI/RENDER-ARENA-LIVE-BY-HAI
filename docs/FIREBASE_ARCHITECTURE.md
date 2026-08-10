# Firebase Architecture

## Firebase role

Firebase can support the live interaction layer for Render Arena.

## Suggested services

- Firestore for locked prompts and metadata
- Realtime Database for live voting and HUD updates
- Firebase Functions for Colorway DNA scoring
- Firebase Hosting for lightweight prototypes
- Firebase Auth for admin/host access

## Collections

- episodes
- prompts
- colorways
- renders
- votes
- sessions
- users
- platformEvents

## Live voting flow

```text
Viewer vote -> Realtime Database -> Arena HUD -> Firestore summary -> Render Vault metadata
```

## Prompt lock flow

```text
Host builds prompt -> DNA score -> Lock Prompt -> Firestore prompt record -> render queue
```

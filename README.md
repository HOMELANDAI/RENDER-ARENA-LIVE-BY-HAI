# Render Arena Live by HAI

Render Arena Live is HomelandAI's live creative production and public viewing experience.

- **Live site:** https://renderarenahai.com
- **Current Sites production version:** 31 (source commit `6bdf27d284f6fb01cef11145fff6009653c5389a`, deployed November 22, 2026)
- **Sites project:** `appgprj_6a989594cec48191a900714f7f169ea7`

## Current experience

The public site includes the Home, Arena, Prompt, Palette, Vault, Studio, Control, XR, Safari, and HAI sections. Its Home scene uses the RA mark and restrained ambient motion. The HAI Method has ten steps—Idea, Prompt, Colorway, Render, Refine, Vote, Reveal, Curate, Vault, World—with a gold surge that moves forward and then reverses.

The Arena has a two-bay battle presentation. Each side reserves an artist name, render image, title, and sponsor position, with a centered VS. Unrevealed work is held back from the public view. A separate embedded Twitch or YouTube player is shown when the producer configures and verifies a live broadcast. Sponsor positions are layout placeholders, not a booking or ad-serving system.

The private production model has a producer and two remote artist bays. The producer signs in, issues artist access codes, names the bays, controls the public reveal together or in sequence, and manages the broadcast configuration. Artists submit from their assigned bays. The control experience also provides local screen, camera, and audio checks; an external encoder such as OBS or Streamlabs handles the actual platform broadcast.

## Repository status and source of truth

This repository was created as a concept, planning, and early scaffold archive. **Its existing `frontend/`, `backend/`, and `firebase/` directories are historical scaffolds; they are not the source deployed at renderarenahai.com.** The current runnable application source is maintained in the Sites project above. A source mirror into this GitHub repository is still pending. Do not deploy the historical scaffold and expect it to match production.

The existing directories remain available for research and production planning:

```text
docs/           Concept, architecture, and workflow notes
branding/       Brand and colorway references
ui/             Earlier interface specifications
prompts/        Creative production briefs
frontend/       Historical scaffold
backend/        Historical scaffold
firebase/       Historical data-model exploration
worlds/         Storyworld concepts
presentations/  Pitch material
PATCHES/        Earlier planning patches
SUMMARY/        Project history
```

## Production sequence

1. The producer prepares the session, destinations, and named Bay 1 and Bay 2 access.
2. Artists create independently from separate locations and submit their work privately.
3. The producer chooses a simultaneous or ordered reveal and opens only selected work to the public Arena.
4. The live program is encoded externally and embedded on the website when a supported source is configured and the show is on air.
5. Approved work can enter the Vault with producer-selected designations.

The public site and the GitHub archive should be reviewed together until the application source has been mirrored here. This README records the production position without presenting the older scaffold as current code.

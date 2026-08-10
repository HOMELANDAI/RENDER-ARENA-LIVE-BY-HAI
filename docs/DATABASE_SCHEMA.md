# Database Schema

## episodes

- id
- title
- date
- platform
- theme
- status
- hostA
- hostB

## colorways

- id
- name
- description
- primaryHex
- secondaryHex
- accentHex
- mood
- textureNotes
- lightingNotes

## prompts

- id
- episodeId
- promptText
- colorwayId
- style
- mood
- constraint
- dnaScore
- lockedAt

## renders

- id
- episodeId
- promptId
- imageUrl
- title
- status
- voteCount
- votePercentage
- xrCandidate
- mintCandidate

## votes

- id
- episodeId
- renderId
- userId
- timestamp

## vaultEntries

- id
- renderId
- promptId
- colorwayId
- notes
- publicUrl
- createdAt

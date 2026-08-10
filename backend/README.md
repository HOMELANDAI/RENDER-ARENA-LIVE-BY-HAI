# Backend Scaffold

The backend should support:

- prompt locking
- vote aggregation
- render metadata
- Render Vault publishing
- colorway DNA scoring
- user/session management
- platform event logging

## Options

Firebase and Supabase are both viable. The project documentation uses Firebase for realtime UI examples, while the broader HomelandAI backend preference may use Supabase.

## Recommended endpoints

- POST /api/prompts/lock
- POST /api/votes
- GET /api/renders
- POST /api/render-vault
- GET /api/colorways
- POST /api/dna-score

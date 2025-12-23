# QuartExpress (MVP)

Portail employeur + portail candidat + diffusion SMS + confirmation "OK-only".

## Déploiement (Vercel + GitHub)
1. Crée un projet Supabase, exécute `supabase.sql`.
2. Déploie sur Vercel, ajoute les variables d’environnement (voir `.env.example`).
3. Dans Supabase Auth > URL Configuration, ajoute les Redirect URLs.
4. Dans Twilio, configure le webhook SMS vers `/api/twilio/inbound`.

# Self-hosted deploy (Tencent Cloud VM)

Production runs on a Tencent Cloud Ubuntu 24.04 VM (IP kept out of this public repo; it is the `DEPLOY_HOST` secret) with Docker Compose:

- `db` — Postgres 16, data in the `deploy_pgdata` volume
- `app` — built from the repo `Dockerfile`
- `caddy` — reverse proxy on :80/:443. Cloudflare proxies `emeta.co.id` in front, so Caddy serves
  plain HTTP (Cloudflare SSL "Flexible") and HTTPS with its own internal cert (Cloudflare SSL "Full").
  For "Full (strict)", replace `tls internal` in `Caddyfile` with a Cloudflare Origin Certificate.

Assets stay on Cloudflare R2 (`cdn.emeta.co.id`); nothing on disk besides Postgres.

## Deploys

Every push to `main` runs `.github/workflows/deploy.yml`: rsync the checkout to `/opt/emeta`, then
`docker compose up -d --build`. Repo secrets: `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_USER`,
`DEPLOY_HOST`. Manual run: Actions → "Deploy (Tencent VM)" → Run workflow.

## Server secrets

`/opt/emeta/deploy/.env` (mode 600, never in git) holds every runtime variable from `.env.example`
plus `SMTP_*` and `POSTGRES_PASSWORD`. Compose builds `DATABASE_URL` from `POSTGRES_PASSWORD`.
Edit it on the server, then `docker compose up -d` in `/opt/emeta/deploy`.

## Common tasks

```bash
ssh ubuntu@<server-ip>
cd /opt/emeta/deploy
docker compose ps
docker compose logs -f app
docker compose exec db pg_dump -U postgres -d emeta -Fc > ~/emeta-$(date +%F).dump   # backup
docker compose exec -T db psql -U postgres -d emeta                                     # SQL shell
```

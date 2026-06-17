# TenPulse Deployment

**Son Güncelleme:** 2026-06-17  
**GitHub Repo:** https://github.com/gorkemkyolai06/tenpulse

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@suncourtstennis.com |
| Şifre | demo123456 |

## Deployment Durumu

| Servis | URL | Durum |
|--------|-----|-------|
| Frontend | Henüz deploy edilmedi | ⏳ Vercel GitHub entegrasyonu gerekli |
| Backend | Henüz deploy edilmedi | ⏳ Railway GitHub entegrasyonu gerekli |
| Health | `<backend-url>/api/health` | ⏳ Bekliyor |

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=<postgresql-connection-string>
JWT_SECRET=<random-secret>
FRONTEND_URL=<vercel-frontend-url>
PORT=4015
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=<railway-backend-url>/api
```

## Yerel Geliştirme

```bash
docker compose up postgres -d

cd backend
cp .env.example .env
npm ci
npm run db:migrate && npm run db:seed
npm run start:dev

cd ../frontend
cp .env.example .env.local
npm ci && npm run dev
```

| Servis | Port |
|--------|------|
| Frontend | 3015 |
| Backend | 4015 |
| PostgreSQL (Docker) | 5455 |

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

- `main` branch push → backend test + integration + frontend build
- Entegrasyon testleri: 18 senaryo (`tests/integration.sh`)

## Railway Yapılandırması

1. GitHub repo `gorkemkyolai06/tenpulse` bağla
2. Root Directory: `backend`
3. Production Branch: `main`
4. Wait for CI: etkin
5. Start command: `npm run deploy` (nixpacks.toml)

## Vercel Yapılandırması

1. GitHub repo `gorkemkyolai06/tenpulse` bağla
2. Root Directory: `frontend`
3. Production Branch: `main`
4. `NEXT_PUBLIC_API_URL` ortam değişkenini ayarla

## Deployment Doğrulama (URL'ler hazır olduğunda)

```bash
curl -s <backend-url>/api/health

curl -s <backend-url>/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@suncourtstennis.com","password":"demo123456"}'
```

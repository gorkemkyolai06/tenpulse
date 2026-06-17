# TenPulse

Tenis tesisi operasyon yönetimi B2B SaaS platformu.

**GitHub:** https://github.com/gorkemkyolai06/tenpulse

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@suncourtstennis.com |
| Şifre | demo123456 |

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
| PostgreSQL | 5455 |

## Modüller

- **Kortlar** — Kort envanteri ve durum takibi
- **Ders Oturumları** — Özel ders, grup ve klinik gelir kayıtları
- **Top Makinesi Bakımı** — Top makinesi servis iş emirleri
- **Kort Bakımı** — Yüzey yenileme, file değişimi, çizgi boyama
- **Kordon Siparişleri** — Raket kordonlama servis siparişleri
- **Fiyat Kademeleri** — Kort kiralama ve ders paketi fiyatlandırması

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, Prisma, PostgreSQL
- Deploy: Railway (backend), Vercel (frontend)

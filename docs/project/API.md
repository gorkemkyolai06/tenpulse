# TenPulse — API (API)

Base URL: `{NEXT_PUBLIC_API_URL}` (production: Railway backend URL + `/api`)

## Auth

| Method | Endpoint | Auth | Status | Açıklama |
|--------|----------|------|--------|----------|
| POST | /api/auth/login | No | 200 | Giriş |
| POST | /api/auth/register | No | 201 | Kayıt |

## Health

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/health | No | 200 |

## Tennis Club

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/tennis-club | Yes | 200 |
| PATCH | /api/tennis-club | Yes | 200 |

## Courts

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/courts | Yes | 200 |
| GET | /api/courts/:id | Yes | 200 |
| POST | /api/courts | Yes | 201 |
| PATCH | /api/courts/:id | Yes | 200 |
| DELETE | /api/courts/:id | Yes | 200 |

## Lesson Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/lesson-sessions | Yes | 200 |
| GET | /api/lesson-sessions/:id | Yes | 200 |
| POST | /api/lesson-sessions | Yes | 201 |
| PATCH | /api/lesson-sessions/:id | Yes | 200 |
| DELETE | /api/lesson-sessions/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/ball-machine-maintenance | Yes | 200 |
| GET | /api/ball-machine-maintenance/urgent | Yes | 200 |
| GET | /api/ball-machine-maintenance/:id | Yes | 200 |
| POST | /api/ball-machine-maintenance | Yes | 201 |
| PATCH | /api/ball-machine-maintenance/:id | Yes | 200 |
| DELETE | /api/ball-machine-maintenance/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/court-maintenance | Yes | 200 |
| GET | /api/court-maintenance/:id | Yes | 200 |
| POST | /api/court-maintenance | Yes | 201 |
| PATCH | /api/court-maintenance/:id | Yes | 200 |
| DELETE | /api/court-maintenance/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/stringing-orders | Yes | 200 |
| GET | /api/stringing-orders/pending | Yes | 200 |
| GET | /api/stringing-orders/:id | Yes | 200 |
| POST | /api/stringing-orders | Yes | 201 |
| PATCH | /api/stringing-orders/:id | Yes | 200 |
| DELETE | /api/stringing-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/rate-tiers | Yes | 200 |
| GET | /api/rate-tiers/:id | Yes | 200 |
| POST | /api/rate-tiers | Yes | 201 |
| PATCH | /api/rate-tiers/:id | Yes | 200 |
| DELETE | /api/rate-tiers/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |

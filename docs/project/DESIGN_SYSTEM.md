# TenPulse — Tasarım Sistemi (DESIGN_SYSTEM)

**Yön:** Clay Court Editorial  
**Oluşturma:** 2026-06-17

## Renk Paleti

| Token | Hex | Kullanım |
|-------|-----|----------|
| Terracotta Clay | #C4662A | Primary accent, CTA buttons |
| Court Green | #2D5A27 | Success states, available courts |
| Chalk White | #FAFAF5 | Background (light mode) |
| Baseline Navy | #1E3A5F | Primary text, headers |
| Warm Gray | #8B8178 | Muted text |

## Tipografi

| Rol | Font | Weight |
|-----|------|--------|
| Display / Headings | Libre Baskerville | 400, 700 |
| Body / UI | Source Sans 3 | 400, 600, 700 |
| Mono / Stats | Source Sans 3 | 600 |

## Spacing Scale

4px base: 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius

- Default: 2px (`--radius: 2px`)
- Cards: 2px with 1px court-line border

## Navigasyon

- **Yapı:** Üst sekme navigasyon (horizontal tabs)
- **Aktif durum:** Terracotta alt çizgi + clay arka plan
- **Mobil:** Yatay scroll tabs

## Bileşen Dili

- `.clay-card` — 1px border, 2px radius, court-line left accent
- `.court-pill-available` — yeşil arka plan
- `.court-pill-in_use` — terracotta arka plan
- `.court-pill-maintenance` — amber arka plan
- `.court-pill-closed` — gri arka plan

## Farklılaşma

| Özellik | TenPulse | KartPulse | BayPulse |
|---------|----------|-----------|----------|
| Navigasyon | Üst tabs | Sol sidebar | Editorial header |
| Renk | Terracotta/yeşil | Siyah/kırmızı/sarı | Yeşil/krem |
| Font | Libre Baskerville | Bebas Neue | Playfair |
| Radius | 2px | 0px | 8px |

Benzerlik skoru: <40% — benzersizlik kriteri karşılandı.

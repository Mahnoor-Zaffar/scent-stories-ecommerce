# Scent & Stories

Luxury direct-to-consumer e-commerce platform for a premium perfume brand. Built to showcase editorial storytelling, performance engineering, and modern React architecture without external state libraries.

[![CI](https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce/actions/workflows/ci.yml)

**Live Demo:** Deploy via [Vercel](https://vercel.com) (see [Deployment Guide](./docs/DEPLOYMENT.md))

**Repository:** [github.com/Mahnoor-Zaffar/scent-stories-ecommerce](https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce)

---

## Overview

Scent & Stories is a portfolio-grade luxury storefront featuring four integrated modules:

| Module | Route | Description |
|--------|-------|-------------|
| Olfactory PDP | `/products/[handle]` | Full-bleed media, fragrance lifecycle breakdown, Scent DNA visualizer |
| Scent Quiz | `/quiz` | Client-side state machine with weighted recommendation engine |
| Private Reserve | `/private-reserve` | VIP dashboard with order archives and consultation booking |
| Checkout | `/checkout` | Cart context, geo-based pricing, express pay zones, webhook emulation |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | SSG for PDPs, middleware for geo routing, built-in SEO |
| Language | TypeScript | Strict typing for catalog schema and checkout flows |
| Styling | Tailwind CSS | Utility-first with custom obsidian/cream/gold design tokens |
| Animation | Anime.js v4 | Timeline and stagger micro-interactions with explicit cleanup |
| State | React Context + useReducer | No Zustand/Redux; native hooks for cart and quiz state machines |
| Testing | Playwright | E2E coverage for quiz and checkout critical paths |
| CI | GitHub Actions | Build, lint, and test on every push and pull request |

---

## Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| LCP | < 1.8s | `next/image` with priority hero, explicit aspect ratios |
| FID | < 50ms | Client components scoped; animations off main thread where possible |
| CLS | < 0.05 | Fixed aspect-ratio containers for images and video |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
git clone https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce.git
cd scent-stories-ecommerce
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:ui  # Playwright interactive UI
```

---

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Homepage and signature collection grid |
| `/products/obsidian-orchid` | SSG | PDP with lifecycle and DNA visualizer |
| `/products/cedar-and-silk` | SSG | PDP |
| `/products/amber-meridian` | SSG | PDP |
| `/quiz` | Static | Guided scent discovery quiz |
| `/private-reserve` | Static | VIP member portal |
| `/checkout` | Static | Cart and checkout pipeline |
| `/api/webhooks` | API | Webhook emulation endpoint |

### Regional pricing (mock geo-IP)

Append a region query param to test currency and duty calculations:

```
?region=US   USD, no duties
?region=GB   GBP, 20% duties
?region=EU   EUR, 19% duties
?region=JP   JPY, 10% duties
?region=AE   AED, 5% duties
```

Example: `http://localhost:3000/checkout?region=GB`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── products/[handle]/  # SSG product detail pages
│   ├── quiz/               # Scent discovery quiz
│   ├── checkout/           # Checkout pipeline
│   ├── private-reserve/    # VIP portal
│   └── api/webhooks/       # Post-purchase webhook emulation
├── components/
│   ├── pdp/                # FragranceLifecycle, ScentDNAVisualizer
│   ├── quiz/               # ScentQuiz state machine UI
│   ├── checkout/           # CheckoutPipeline
│   ├── vip/                # PrivateReserveDashboard, ConsultationCalendar
│   └── layout/             # Header, Footer
├── context/
│   └── CartContext.tsx     # Unified cart + checkout state
├── data/
│   ├── catalog.ts          # Mock product catalog (3 fragrances)
│   └── vip-orders.ts       # VIP order history with batch traceability
├── lib/
│   ├── anime.ts            # Anime.js wrapper with cleanup helpers
│   ├── geo-ip.ts           # Region detection and currency conversion
│   ├── quiz-engine.ts      # Quiz reducer and scoring algorithm
│   ├── seo.ts              # JSON-LD schema generators
│   └── webhooks.ts         # Post-purchase webhook simulation
├── middleware.ts           # Mock geo-IP region header injection
└── types/
    └── catalog.ts          # Product, Variant, and order interfaces
```

---

## Architecture Highlights

### Animation lifecycle (Anime.js)

All Anime.js instances are created inside `useEffect` and cleaned up with `.pause()` on unmount to prevent memory leaks. Stagger and timeline APIs drive the fragrance lifecycle and quiz transitions.

### Quiz state machine

The scent quiz uses a pure `useReducer` with weighted scoring across mood, setting, and ingredient preference dimensions. Results update in-place without a page reload.

### Cart and checkout

`CartContext` combines `useReducer` for line items and checkout step progression with region-aware pricing from the geo-IP utility layer.

### SEO

Each PDP exports static metadata and injects JSON-LD `@type: Product` schema. The root layout includes Organization schema.

---

## Catalog Schema

```typescript
interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  concentration: 'Extrait de Parfum' | 'Eau de Parfum' | 'Eau de Toilette' | 'Cologne';
  olfactory_family: ('Woody' | 'Oriental' | 'Floral' | 'Citrus' | 'Chypre' | 'Fougère')[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  created_at: string;
}

interface Variant {
  id: string;
  product_id: string;
  sku: string;           // Format: SS-[FRAGRANCE_CODE]-[SIZE_ML]
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  size_ml: number;
  weight_g: number;
}
```

---

## Current Limitations

| Area | Status |
|------|--------|
| Payments | UI mock only (Apple Pay, Google Pay zones) |
| Authentication | VIP portal uses client-side mock auth |
| Product data | Static TypeScript catalog, no CMS or database |
| SMS/Email | Webhook emulation only, no real provider integration |

See [Roadmap](#roadmap) for planned v2 work.

---

## Roadmap

- [ ] Stripe integration for real checkout
- [ ] NextAuth or Clerk for Private Reserve authentication
- [ ] Sanity CMS for editorial product content
- [ ] Lighthouse CI in GitHub Actions
- [ ] Real geo-IP via Vercel Edge or Cloudflare headers

---

## Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Portfolio Case Study](./docs/CASE_STUDY.md)
- [Product Requirements](./PRD.md)

---

## Author

**Mahnoor Zaffar**

Built as a portfolio project demonstrating full-stack frontend architecture, luxury UX, and performance-conscious engineering.

---

## License

MIT. See [LICENSE](./LICENSE).

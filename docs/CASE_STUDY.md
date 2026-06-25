# Case Study: Scent & Stories

A luxury e-commerce platform built to demonstrate senior-level frontend architecture, sensory UX design, and performance engineering.

---

## The Problem

Premium fragrance brands sell emotion and narrative, not just product SKUs. Most e-commerce templates fail to convey olfactory storytelling, guide discovery for non-expert buyers, or serve high-value repeat customers with differentiated experiences.

The goal was to build a direct-to-consumer platform that feels editorial, performs like a production app, and showcases modern React patterns without over-engineering.

---

## My Approach

### 1. Story-first product detail pages

Instead of a standard gallery-and-specs layout, each PDP includes:

- A full-bleed hero with ambient video and zero layout shift via explicit aspect ratios
- A **Fragrance Lifecycle** component animating Top, Heart, and Base notes with Anime.js stagger timelines
- A **Scent DNA Visualizer** using SVG radar charts and horizontal performance scales for Longevity and Sillage

These components turn technical fragrance data into a visual narrative.

### 2. Guided discovery without backend dependency

The scent quiz is a client-side state machine powered by `useReducer`. A weighted scoring algorithm maps mood, setting, and ingredient preferences to the catalog and surfaces a recommendation without a page reload.

This keeps the experience fast while demonstrating algorithm design and state management discipline.

### 3. Tiered customer experience

The **Private Reserve** portal simulates a VIP tier with:

- Historical order archives with batch numbers (e.g. `Batch No. 0420-26`)
- Expandable ingredient sourcing breakdowns per purchase
- An interactive consultation booking calendar

This shows how to structure authenticated experiences even before a real auth provider is wired in.

### 4. International-ready checkout

Checkout uses a unified `CartContext` with a mock geo-IP middleware layer that recalculates currency, import duties, and shipping by region. Post-purchase webhook emulation triggers order, fulfillment, and SMS event payloads.

The pipeline is mock today but architected for Stripe and real webhook providers in v2.

---

## Technical Decisions

| Decision | Why |
|----------|-----|
| Anime.js over Framer Motion | Fine-grained timeline control for luxury micro-interactions; explicit cleanup in `useEffect` |
| Native React state over Zustand | Cart and quiz flows are scoped; Context + useReducer avoids unnecessary dependencies |
| SSG for PDPs | Pre-rendered product pages for SEO and fast LCP |
| Playwright E2E | Validates quiz and checkout flows in CI |
| TypeScript catalog schema | Strict Product/Variant interfaces enforce data consistency across modules |

---

## Performance Strategy

- `next/image` with `priority` on hero assets
- Fixed aspect-ratio containers for all media to target CLS < 0.05
- Client components isolated to interactive layers; pages remain server-rendered where possible
- Animation instances paused on unmount to prevent memory leaks

---

## Results

- Production build passes with zero TypeScript errors
- 11 routes including 3 statically generated PDPs
- CI pipeline: lint, build, and E2E on every push
- Four integrated modules from a single PRD spec

---

## What I Would Build Next

1. **Stripe Checkout** for real payment processing
2. **Clerk or NextAuth** to gate Private Reserve with real authentication
3. **Sanity CMS** so product copy and imagery are editable without code changes
4. **Vercel Edge geo-IP** replacing the mock region middleware
5. **Lighthouse CI** to enforce Core Web Vitals budgets in pull requests

---

## Portfolio Talking Points

Use these when presenting the project:

- "I built a luxury PDP with SVG data visualization and timeline-based note animations."
- "The scent quiz is a pure useReducer state machine with a weighted recommendation engine."
- "Checkout handles multi-region currency, duties, and shipping without a third-party state library."
- "Every Anime.js animation has explicit lifecycle cleanup to prevent memory leaks."
- "PDPs ship with JSON-LD Product schema for rich search results out of the box."

---

## Links

- **GitHub:** [github.com/Mahnoor-Zaffar/scent-stories-ecommerce](https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce)
- **Live Demo:** Add your Vercel URL after deployment
- **PRD:** [PRD.md](../PRD.md)

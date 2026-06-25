# Deployment Guide

This project is optimized for [Vercel](https://vercel.com), the recommended host for Next.js App Router applications.

---

## Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the GitHub repository:
   `Mahnoor-Zaffar/scent-stories-ecommerce`
3. Vercel auto-detects Next.js. Use these settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`
4. Click **Deploy**.
5. After deployment, copy the production URL (e.g. `https://scent-stories-ecommerce.vercel.app`).
6. Update the **Live Demo** link in `README.md` with your URL.

---

## Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

Follow the prompts to link the project to your Vercel account.

---

## Post-Deploy Checklist

- [ ] Confirm homepage loads at production URL
- [ ] Test all three PDP routes (`/products/obsidian-orchid`, etc.)
- [ ] Complete the scent quiz end-to-end
- [ ] Add a product to cart and run through checkout
- [ ] Test regional pricing: `/checkout?region=GB`
- [ ] Update README live demo link
- [ ] Add production URL to portfolio and LinkedIn

---

## Environment Variables

No environment variables are required for the current mock-data implementation.

When adding Stripe, auth, or a CMS in v2, create a `.env.local` file locally and add the same keys in Vercel under **Project Settings > Environment Variables**.

Example future variables:

```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## Custom Domain (Optional)

1. In Vercel, go to **Project Settings > Domains**.
2. Add your domain (e.g. `scentandstories.dev`).
3. Update DNS records as instructed by Vercel.
4. SSL is provisioned automatically.

---

## GitHub Actions CI

Every push to `main` and every pull request triggers:

- `npm ci`
- `npm run lint`
- `npm run build`
- Playwright E2E tests (against production build)

View runs at: [github.com/Mahnoor-Zaffar/scent-stories-ecommerce/actions](https://github.com/Mahnoor-Zaffar/scent-stories-ecommerce/actions)

---

## Troubleshooting

### Build fails on Vercel

Run locally first:

```bash
npm run build
```

Fix any TypeScript or ESLint errors before redeploying.

### Images not loading

Remote images use `images.unsplash.com`. The domain is allowlisted in `next.config.ts`. Add any new image host there.

### Middleware region header

Region detection uses `Accept-Language` headers or the `?region=` query param. On Vercel, you can later replace this with `x-vercel-ip-country` for real geo-IP.

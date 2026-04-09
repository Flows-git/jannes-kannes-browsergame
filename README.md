# Warcraft 3 Quiz App – Jannes Kann Es

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?logo=vuetify&logoColor=white)](https://vuetifyjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![pnpm](https://img.shields.io/badge/pnpm-package_manager-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f0d7ec05-44f2-498a-b701-869edc2b0f61/deploy-status)](https://app.netlify.com/projects/jannes-kann-es/deploys)

<div style="text-align: center">
  <img src="./public/logo.png" alt="Jannes Kann es Logo" width="400"/>
</div>
Logo created by:

[Font Generator](https://www.textstudio.com/)

---

> A Warcraft 3 quiz game based on the popular section "Jannes Kann Es" from the internet tv show "Creepjack".

## Features

- Three game modes:
  - **Classic** – 3 random questions for a quick round
  - **Ranked** – all questions, 3 lives, submit your score to the leaderboard
  - **Endless** – all questions, no life limit
- Global **leaderboard** with rank highlighting and confetti for top 3 finishers
- **Session-based gameplay** with encrypted server-side cookies
- **Anti-cheat** validation on leaderboard submissions (timing, state integrity, rate limiting)
- **Admin dashboard** for managing questions, tags, and viewing analytics with ECharts
- **Mobile-friendly** responsive UI built with Vuetify 3
- Fully **typed** with TypeScript and tested with Vitest + Playwright

## Development

### Setup

Install the dependencies:

```bash
pnpm install
pnpm run setup # downloads wc3 icons to /public/warcraft3_icons
```

Create a `.env` file:

```bash
NUXT_SUPABASE_URL=UrlToYourSupabaseInstance
NUXT_SUPABASE_API_KEY=SupabaseSecretKey
NUXT_SESSION_SECRET=RandomStringForCookieEncryption
# optional:
NUXT_PUBLIC_LEADERBOARD_MIN_CORRECT_ANSWERS=0 # default is 3
NUXT_METRICS=false # auto false in dev
```

### Start Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

Start the admin dashboard:

```bash
pnpm run dev:admin
```

### Tests

```bash
pnpm run test       # all tests (unit + e2e)
pnpm run test:unit  # Vitest with coverage
pnpm run test:e2e   # Playwright
```

### Lint

```bash
pnpm run lint       # check
pnpm run lintfix    # auto-fix
```

## Build for Production

Build the application for production:

```bash
pnpm run build
```

Locally preview the production build:

```bash
pnpm run preview
```

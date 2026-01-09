<p align="center">
  <a href="https://nuxt.com/">
    <img src="https://img.shields.io/badge/Nuxt-4.x-green?logo=nuxt&logoColor=white" alt="Nuxt 4" />
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://bun.sh/">
    <img src="https://img.shields.io/badge/Bun-JS%20Runtime-000000?logo=bun&logoColor=white" alt="Bun" />
  </a>
</p>

<div style="text-align: center">
  <img src="./public/logo.png" alt="Jannes Kann es Logo" width="400"/>
</div>
Logo created by: <a href="https://www.textstudio.com/">Font generator</a>

---
# Warcraft 3 Quiz App -  Jannes Kann es

> This is a Warcraft 3 quiz game based on the popular section "Jannes Kann Es" from the internet tv show "Creepjack"

## Development
### Setup

Install the dependencies:
```bash
bun install
```

Create `.env` file:
```bash
NUXT_SUPABASE_URL=UrlToYourSupabaseInstance
NUXT_SUPABASE_API_KEY=SupabaseSecretKey
NUXT_SESSION_SECRET=RandomStringForCookieEncryption
```
### Start Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

### Add Questions to Supabase
Run the script to add questions to your Supabase database:
```bash
bun run setup:db
```

## Build for Production

Build the application for production:
```bash
bun run build
```

Locally preview production build:
```bash
bun run preview
```

## Docs

**Server Session**
Represents the current state of a game
When data is empty no game is started

contains:
- the meta data of the current game
- a list of ids of the selected questions for the game
- The current question (with randomized answer order)is  KK

### API Endpoints
| Method | Endpoint | Parameter | Description |
|--------|----------|-------------|-------------|
| `POST` | `/api/game/start` | mode: [GameMode](./shared/types/index.d.ts#L73),<br> settings?: [GameSettings](./shared/types/index.d.ts#L84)  | Starts a new game |
| `GET` | `/api/game` | - | Returns the current question and meta |
| `POST` | `/api/game` | answer: **string** | Answer the current question |
| `DELETE` | `/api/game` | - | Ends the current game and deletes the session |
| `POST` | `/api/game/restart` | - | Restart the current game with the same GameSettings |
| `GET` | `/api/leaderboard` | page?: **string** (default: 1),<br> perPage?: **string** (default: 10)  | Get the leaderboard with pagination |
| `POST` | `/api/leaderboard` | name: **string** | Submit a new score to the leaderboard |
| `POST` | `/api/leaderboard/rank` | name: **string** | Calculates the rank of the currently running game |

# Jannes Kann es - Das Spiel

> This is the browsergame for the popular game "Jannes Kann es"

## Setup

Make sure to install the dependencies:

```bash
bun install
# Update Question JSON
bun run script:parseQuestionsCSV
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## API

[GET] `/api/game/start` - starts a new game
[GET] `/api/game` - returns the current question, when a game is started
[POST] `/api/game` - expects the answer of the current question - params: { answer: 'Answer of the Question' }
[GET] `/api/game/end` - end a game manually

<div style="text-align: center">
  <img src="./public/logo.png" alt="Jannes Kann es Logo" width="400"/>
</div>
Logo created by: <a href="https://www.textstudio.com/">Font generator</a>

---
# Warcraft 3 Quiz App -  Jannes Kann es

> This is a Warcraft 3 quiz game based on the popular section "Jannes Kann Es" from the internet tv show "Creepjack"

## Development
### Setup

Make sure to install the dependencies and run the setup script:

```bash
bun install
# downloads the wc3 icons
# parses the questions, tags to json
bun run setup
```

### Start Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
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

Check out the [nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docs

**Server Session**
Represents the current state of a game
When data is empty no game is started

contains:
- the meta data of the current game
- a list of ids of the selected questions for the game
- The current question (with randomized answer order)is  KK

### API Endpoints

**[POST]** `/api/game/start`
Parameter: GameSettings
Starts a new game with the passed settings.
Inits the server session and selects random questions to be answered

**[GET]** `/api/game`
Returns the current question
(maybe use websockets instead later)

**[POST]** `/api/game`
Parameter: { answer: string }
Validates the answer of the current question and updates the session

**[DELETE]** `/api/game`
Ends a game manually

**[GET]** `/api/game/result`
Returns the game result when the game is finished
contains:
- Correct Questions / QuestionCount
- Result in percent
- Game Time
- Answered questions with result (player answer, correct answer

## Download playlist video names:
yt-dlp https://www.youtube.com/playlist\?list\=PLfU2RMxoOiSBinJrGNPSJffiJybUEFyYt --skip-download --no-warning --print "%(id)s;\"%(title)s\";%(upload_date)s"

interface TagCsv {
  name: string
  icon?: string
  main_attributes: string
}

interface GameTag {
  name: string
  icon?: string
  reforgedIcon?: string
  mainAttributes: Array<string>
  children?: Array<GameTag>
}

interface QuestionCsv {
  id: number
  episode: string
  creepjack_episode: string
  question_nr: string
  question_time_on_stream: string
  question: string
  answer: string
  other_answers: string
}

interface GameQuestionPlayer {
  id: string | number // pattern: episode_creepjackEpisode_questionNr
  meta: {
    episode: string
    creepjackEpisode: string
    questionNr: string
    questionTimeOnStream: string
  }
  question: string
  questionNr: number
  answers: Array<string>
}

interface GameQuestion {
  id: string | number // pattern: episode_creepjackEpisode_questionNr
  meta: {
    episode: string
    creepjackEpisode: string
    questionNr: string
    questionTimeOnStream: string
    // jannesAnswer: string
    jannesCorrect: boolean
  }
  question: string
  answers: Array<string>
  correctAnswer: string
  //
}

interface GameSession {
  currentQuestion: GameQuestion
  questions: Array<string>
  running: boolean
  currentQuestionNr: number
  answeredQuestions: number
  totalQuestions: number
  correctAnswers: number
  totalLives?: number
  remainingLives?: number
  startTime: number
  endTime?: number
  gameTime?: string
}

/**
 * params to start a game
 * EP: /api/game/start
 */
interface GameStartParams {
  mode: 'classic' | 'ranked' | 'endless'
  settings?: GameSettings
}

interface GameSettings {
  questionCount?: number
  liveCount?: number
  // maxFailtures?: number
  // jokerCount?: number
}

interface GameMode {
  validateGameSettings: (settings: GameSettings) => boolean
  createGameSessionData: (settings: GameSettings) => GameSession
}

interface GameResponseMeta {
  running: boolean
  currentQuestion: number
  answeredQuestions: number
  totalQuestions: number
  correctAnswers: number
  totalLives?: number
  remainingLives?: number
  gameTime?: string
}

interface GetQuestionRespone {
  question: GameQuestionPlayer
  meta: GameResponseMeta
}

interface AnswerQuestionResponse {
  correct: boolean
  corretAnswer: string
}

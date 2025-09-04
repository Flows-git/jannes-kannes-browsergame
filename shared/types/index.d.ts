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
  author?: string
}

interface GameQuestionClient {
  id: string | number
  meta: {
    episode: string
    creepjackEpisode: string
    questionNr: string
    questionTimeOnStream: string
    author?: string
  }
  question: string
  questionNr: number
  answers: Array<string>
}

interface GameQuestionServer {
  id: string | number
  meta: {
    episode: string
    creepjackEpisode: string
    questionNr: string
    questionTimeOnStream: string
    // jannesAnswer: string
    jannesCorrect: boolean
    author?: string
  }
  question: string
  answers: Array<string>
  correctAnswer: string
  //
}

interface GameSession {
  currentQuestion: GameQuestionServer
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
  averageAnswerTime: string
}

type GameMode = 'classic' | 'ranked' | 'endless'

/**
 * params to start a game
 * EP: /api/game/start
 */
interface GameStartParams {
  mode: GameMode
  settings?: GameSettings
}

interface GameSettings {
  questionCount?: number
  liveCount?: number
  // jokerCount?: number
}

interface GameMeta {
  running: boolean
  currentQuestion: number
  answeredQuestions: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  totalLives?: number
  remainingLives?: number
  gameTime?: string
  averageAnswerTime: string
  answeredQuestionsTotalPercent: number
}

interface GetQuestionRespone {
  question: GameQuestionClient
  meta: GameMeta
}

interface AnswerQuestionResponse {
  correct: boolean
  corretAnswer: string
}

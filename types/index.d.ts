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
  id: string // pattern: episode_creepjackEpisode_questionNr
  meta: {
    episode: string
    creepjackEpisode: string
    questionNr: string
    questionTimeOnStream: string
  }
  question: string
  answers: Array<string>
}

interface GameQuestion {
  id: string // pattern: episode_creepjackEpisode_questionNr
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
  totalQuestions: number
  correctAnswers: number
}

/**
 * params to start a game
 * EP: /api/game/start
 */
type GameStartParams = GameStartParamsClassic | GameStartParamsEndless

interface GameStartParamsBase {
  // category: string
}

interface GameStartParamsClassic extends GameStartParamsBase {
  type: 'classic'
  questionsCount: number
}

interface GameStartParamsEndless extends GameStartParamsBase {
  type: 'endless'
  maxMistakes: number // -1 === endless mistakes

}

interface GameSettings {
  // mode?: 'classic' | 'endless'
  questionCount?: number
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
  totalQuestions: number
  correctAnswers: number
}

interface GetQuestionRespone {
  question: GameQuestionPlayer
  meta: GameResponseMeta
}

interface AnswerQuestionResponse {
  correct: boolean
  corretAnswer: string
}

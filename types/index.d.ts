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
  questions: Array<GameQuestion>
  running: boolean
  currentQuestion: number
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

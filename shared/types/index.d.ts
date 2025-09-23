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
  answer_video_time: string
  answer: string
  other_answers: string
  author?: string
}

interface QuestionDB {
  id: number
  question: string
  answers: Array<string>
  correctAnswer: string
  author?: string
  creepjackEpisode: number
  jkEpisode: string
  questionNr: number
  jannesAnswer: string
  questionTimeOnStream: string
  answerTimeOnStream: string
}

interface GameQuestion {
  id: string | number
  meta: {
    episode: string
    creepjackEpisode: number
    questionNr: number
    questionTimeOnStream: string
    author?: string
  }
  question: string
  questionNr: number
  answers: Array<string>
}

interface GameSession {
  gameMode: GameMode
  currentQuestion: QuestionDB
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
  mode: GameMode
  questionCount?: number
  liveCount?: number
  // jokerCount?: number
}

interface GameMeta {
  running: boolean
  mode: GameMode
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
  question: GameQuestion
  meta: GameMeta
}

interface AnswerQuestionResponse {
  correct: boolean
  correctAnswer: string
}

interface LeaderboardEntry {
  id?: number
  name: string
  score: number
  correctAnswers: number
  usedJoker: number
  gameTime: string
  averageAnswerTime: string
}

interface LeaderboardListEntry extends LeaderboardEntry {
  rank: number
  position: number
}

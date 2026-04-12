interface TagCsv {
  name: string
  icon?: string
  main_attributes: string
}

interface GameTag {
  id: number
  name: string
  icon?: string
  reforgedIcon?: string
  parents?: Array<string>
  children?: Array<string>
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
  tags?: Array<GameTag>
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
  sessionId: string
  leaderboardId?: string
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
  submitted?: boolean
}

type GameMode = 'classic' | 'ranked' | 'endless'

/**
 * params to start a game
 * EP: /api/game/start
 */
interface GameStartParams {
  mode: GameMode
  settings?: GameSettings
  leaderboardId?: string
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
}

interface GameResult {
  mode: GameMode
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  wrongAnswers: number
  gameTime: string
  averageAnswerTime: string
  answeredQuestionsTotalPercent: number
  ranking?: GameResultRank
}

interface GameResultRank {
  rank?: number
  existingIsBetter?: boolean
  existingLeaderboardEntry?: LeaderboardEntry
}

interface ExistingLeaderboardEntryInfo {
  name: string
  score: number
  gameTime: string
  /**
   * If true, the existing entry is better than (or equal to) the current
   * game result and submitting would be rejected by the server.
   */
  existingIsBetter: boolean
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
  id?: string
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
  isPlayerEntry?: boolean
}

interface LeaderboardSubmitResponse {
  ok: boolean
  redirect?: string
  leaderboardId?: string
  reason?: 'not_better'
  existing?: {
    name: string
    score: number
    gameTime: string
  }
}

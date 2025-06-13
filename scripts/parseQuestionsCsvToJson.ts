import { parseCsvToJson } from './helper/parseCsvToJson'

export async function parseQuestionsCsvToJson() {
  parseCsvToJson<QuestionCsv, GameQuestionServer>('questions', (question) => {
  // Check is Jannes has answered correctly
    const jannesCorrect = question.answer.includes('(J)')
    // Save correct answer
    const correctAnswer = question.answer.replace('(J)', '').trim()
    // Parse all possible answers to an Array
    const answers = `${question.answer}| ${question.other_answers}`.split('|').map(a => a.replaceAll('(J)', '').trim()).filter(n => n)
    return {
      // id: `${question.episode}_${question.creepjack_episode}_${question.question_nr}`,
      id: question.id,
      question: question.question,
      answers,
      correctAnswer,
      meta: {
        episode: question.episode,
        creepjackEpisode: question.creepjack_episode,
        questionNr: question.question_nr,
        questionTimeOnStream: question.question_time_on_stream,
        jannesCorrect,
      },
    }
  })
}

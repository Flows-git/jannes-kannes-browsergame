import { parseCsvToJson } from './helper/parseCsvToJson'

export async function parseQuestionsCsvToJson() {
  return parseCsvToJson<QuestionCsv, QuestionDB>('questions', (question) => {
    // Save correct answer
    const correctAnswer = question.answer.replace('(J)', '').trim()
    // Parse all possible answers to an Array
    let answers = `${question.answer}| ${question.other_answers}`.split('|').map(a => a.trim())
    // find Jannes answer
    const jannesAnswer = answers.find(a => a.includes('(J)'))?.replaceAll('(J)', '').trim() ?? ''
    // remove (J) which indicates jannes answer
    answers = answers.map(a => a.replaceAll('(J)', '').trim())
    const q: QuestionDB = {
      // id: `${question.episode}_${question.creepjack_episode}_${question.question_nr}`,
      id: question.id,
      question: question.question,
      answers,
      correctAnswer,
      jkEpisode: question.episode,
      creepjackEpisode: Number.parseInt(question.creepjack_episode),
      questionNr: Number.parseInt(question.question_nr),
      questionTimeOnStream: question.question_time_on_stream,
      answerTimeOnStream: question.answer_video_time,
      jannesAnswer,
      author: question.author?.length ? question.author : undefined, // Only add author if it exists
    }
    return q
  })
}

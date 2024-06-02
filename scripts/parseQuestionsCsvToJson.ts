import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import csvToJson from 'convert-csv-to-json'
import { shuffleAnswers } from '~/server/utils/questions'

// Load all Questions from CSV
const questions: QuestionCsv[] = await csvToJson.getJsonFromCsv(path.join(process.cwd(), 'scripts', 'questions.csv'))

const parsedQuestions: GameQuestion[] = []

for (const question of questions) {
  // Check is Jannes has answered correctly
  const jannesCorrect = question.answer.includes('(J)')
  // Save correct answer
  const correctAnswer = question.answer.replace('(J)', '').trim()
  // Parse all possible answers to an Array
  const answers = `${question.answer}| ${question.other_answers}`.split('|').map(a => a.replaceAll('(J)', '').trim()).filter(n => n)
  shuffleAnswers(answers)
  shuffleAnswers(answers)
  shuffleAnswers(answers)

  parsedQuestions.push({
    id: `${question.episode}_${question.creepjack_episode}_${question.question_nr}`,
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
  })
}

fs.writeFile(path.join(process.cwd(), 'public', 'questions.json'), JSON.stringify(parsedQuestions), (err) => {
  if (err) {
    console.error(err)
  }
  else {
    // file written successfully
  }
})

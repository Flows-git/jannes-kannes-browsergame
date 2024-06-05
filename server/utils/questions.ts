import questionsJson from '@/public/questions.json'

const questions: GameQuestion[] = questionsJson

/**
 * Get n random questions for JannesKannes
 */
export async function getRandomQuestions(count: number) {
  const selectedQuestions: GameQuestion[] = []
  while (selectedQuestions.length < count) {
    const addedQuestionIds: string[] = []
    const question_id = getRandomInt(0, questions.length - 1)
    if (!addedQuestionIds.find(q => q === questions[question_id].id)) {
      const question = questions[question_id]
      shuffleAnswers(question.answers)
      selectedQuestions.push(question)
      addedQuestionIds.push(question.id)
    }
  }

  return selectedQuestions
}

/**
 * Shuffle the answers to have every round another order
 */
export function shuffleAnswers(array: Array<string>) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

/**
 * Parse Question to the data the player gets - so no answer obviously :P
 */
export function parseQuestion(question: GameQuestion): GameQuestionPlayer {
  return {
    id: question.id,
    question: question.question,
    answers: question.answers,
    meta: {
      creepjackEpisode: question.meta.creepjackEpisode,
      episode: question.meta.episode,
      questionNr: question.meta.questionNr,
      questionTimeOnStream: question.meta.questionTimeOnStream,
    },
  }
}

// Helper
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

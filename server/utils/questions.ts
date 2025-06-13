import questionsJson from '@/data/questions.json'

const questions: GameQuestionServer[] = questionsJson

export function getAllQuestionsCount() {
  return questions.length
}

export function getQuestionById(id: string | number) {
  const question = questions.find(q => q.id === id)
  if (!question) {
    throw createError('question not found')
  }
  return question
}

export function getQuestionByIdForPlayer(id: string) {
  const question = getQuestionById(id)
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

/**
 * Get n random question Ids for JannesKannes
 */
export function getRandomQuestionIds(count: number) {
  // Get all question Ids
  const qIds = questions.map(q => q.id)

  // Randomize order of question Ids
  randomizeArrayOrder(qIds)

  return qIds.slice(0, count)
}

/**
 * Randomises the order of the passed array directly in the array
 * return is not necessary but helpful if you want to assign the array to something
 */
export function randomizeArrayOrder(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

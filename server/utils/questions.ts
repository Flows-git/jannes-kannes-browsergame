async function getAllQuestionsIds(): Promise<string[]> {
  const supabase = await useSupabaseServer()

  const { data, error } = await supabase
    .from('questions')
    .select('id')

  if (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return data.map(q => q.id)
}

export async function getAllQuestionsCount() {
  const supabase = await useSupabaseServer()
  const { count, error } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return count ?? 0
}

export async function getQuestionById(id: string | number): Promise<QuestionDB> {
  const supabase = await useSupabaseServer()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .filter('id', 'eq', id)
    .single<QuestionDB>()

  if (error) {
    throw createError('question not found')
  }
  return data
}

/**
 * Get n random question Ids for JannesKannes
 */
export async function getRandomQuestionIds(count: number) {
  // Get all question Ids
  const qIds = await getAllQuestionsIds()
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

/**
 * Get the percentage of answered questions from all questions
 * @param answeredQuestion
 * @returns percentage of players answered questions in relation to total questions
 */
export async function getAnsweredQuestionsInPercent(answeredQuestion: number) {
  const totalQuestions = await getAllQuestionsCount()
  return Number(((answeredQuestion / totalQuestions) * 100).toFixed(2))
}

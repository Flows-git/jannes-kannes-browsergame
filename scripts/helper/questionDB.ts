import { useSupabase } from './supabase'

export async function useQuestionDB() {
  const supabase = await useSupabase()

  function parseQuestionForDB(q: GameQuestionServer): QuestionDB {
    return {
      id: q.id as number,
      question: q.question,
      answers: q.answers,
      correctAnswer: q.correctAnswer,
      author: q.meta.author,
      creepjackEpisode: Number.parseInt(q.meta.creepjackEpisode),
      jkEpisode: q.meta.episode,
      questionNr: Number.parseInt(q.meta.questionNr),
      jannesAnswer: q.meta.jannesAnswer,
      questionTimeOnStream: q.meta.questionTimeOnStream,
      answerTimeOnStream: q.meta.answerTimeOnStream,
    }
  }

  async function addQuestionToDB(q: QuestionDB) {
    const result = await supabase.from('questions').insert(q)
    if (result.error) {
      return false
    // console.error(result.error)
    }
    return true
  }

  async function addQuestionListToDB(questions: Array<QuestionDB>) {
    const skipped: Array<number> = []

    await Promise.all(questions.map(async (q) => {
      const success = await addQuestionToDB(q)
      if (!success) {
        skipped.push(q.id)
      }
    }))
    return skipped
  }

  return {
    parseQuestionForDB,
    addQuestionToDB,
    addQuestionListToDB,
  }
}

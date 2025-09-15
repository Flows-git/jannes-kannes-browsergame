import { getLeaderboard } from '~~/server/utils/leaderboard'

export default defineEventHandler(async (event) => {
  return await getLeaderboard()
})

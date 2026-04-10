const STORAGE_KEY = 'jke-leaderboard-id'

export function useLeaderboard() {
  const leaderboardId = computed({
    get: () => {
      if (!import.meta.client) {
        return undefined
      }
      return window.localStorage.getItem(STORAGE_KEY) ?? undefined
    },
    set: (value: string | undefined) => {
      if (!import.meta.client || !value) {
        return
      }
      window.localStorage.setItem(STORAGE_KEY, value)
    },
  })

  return {
    leaderboardId,
  }
}

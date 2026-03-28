const submissions = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_SUBMISSIONS = 5

export function checkLeaderboardRateLimit(ip: string): void {
  const now = Date.now()
  const timestamps = submissions.get(ip)?.filter(t => now - t < WINDOW_MS) ?? []

  if (timestamps.length >= MAX_SUBMISSIONS) {
    throw createError({ status: 429, statusMessage: 'Too many submissions. Try again later.' })
  }

  timestamps.push(now)
  submissions.set(ip, timestamps)
}

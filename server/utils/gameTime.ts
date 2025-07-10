/**
 * Calculates the average time to answer a question in a game.
 * usage: getAverageAnswerTimeString(date.getTime(), answeredQuestions)
 * @param startTime - The start time of the game in milliseconds.
 * @param answeredQuestions - The number of questions answered by the player.
 * @returns A string representing the average answer time.
 */
export function getAverageAnswerTimeString(startTime: number, answeredQuestions: number) {
  const averageSeconds = getAverageAnswerTimeInSeconds(startTime, answeredQuestions)
  return parseTimeToString(averageSeconds)
}

/**
 * Calculates the average time to answer a question in seconds.
 * @param startTime - The start time of the game in milliseconds.
 * @param answeredQuestions - The number of questions answered by the player.
 * @returns The average answer time in seconds.
 */
function getAverageAnswerTimeInSeconds(startTime: number, answeredQuestions: number) {
  const currentTime = new Date().getTime()
  const totalSeconds = getTimeDurationInSeconds(startTime, currentTime)
  return totalSeconds / (answeredQuestions || 1)
}

/**
 * Gets a string representation of the time duration between two timestamps.
 * usage: getTimeDurationString(date.getTime(), new Date().getTime())
 * @param startTime - The start time in milliseconds.
 * @param endTime - The end time in milliseconds.
 * @returns A string representing the time duration.
 */
export function getTimeDurationString(startTime: number, endTime: number): string {
  const totalSeconds = getTimeDurationInSeconds(startTime, endTime)
  return parseTimeToString(totalSeconds)
}

/**
 * Calculates the total game time in seconds from start to end.
 * @param startTime - The start time in milliseconds.
 * @param endTime - The end time in milliseconds.
 * @returns Total game time in seconds.
 */
function getTimeDurationInSeconds(startTime: number, endTime: number): number {
  const diffMs = endTime - startTime // Difference in ms
  const totalSeconds = Math.floor(diffMs / 1000)
  return totalSeconds
}

/**
 * Parses a time in seconds to a string format like "1h 2m 3s".
 * @param timeInSeconds
 * @returns string representation of the time
 */
function parseTimeToString(timeInSeconds: number): string {
  let time = ``
  const hours = Math.floor(timeInSeconds / 3600)
  if (hours > 0) {
    time += `${hours}h `
  }
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  if (minutes > 0) {
    time += `${minutes}m `
  }
  const seconds = Math.floor(timeInSeconds % 60)
  time += `${seconds}s`

  return time
}

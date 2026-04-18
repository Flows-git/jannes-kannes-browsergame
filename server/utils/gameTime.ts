/**
 * Calculates the average time to answer a question in ms.
 * @param startTime - The start time of the game in ms.
 * @param endTime - The end time of the game in ms.
 * @param answeredQuestions - The number of questions answered by the player.
 * @returns The average answer time in ms.
 */
export function getAverageAnswerTime(startTime: number, endTime: number, answeredQuestions: number) {
  const duration = getTimeDuration(startTime, endTime)
  return getAverageAnswerTimeDuration(duration, answeredQuestions)
}

export function getAverageAnswerTimeDuration(duration: number, answeredQuestions: number) {
  return answeredQuestions > 0 ? Math.floor(duration / answeredQuestions) : 0
}

/**
 * Calculates the total game time in ms from start to end.
 * @param startTime - The start time in ms.
 * @param endTime - The end time in ms.
 * @returns Duration in ms
 */
export function getTimeDuration(startTime: number, endTime: number): number {
  return endTime - startTime
}

/**
 * Parses a time in seconds to a string format like "1h 2m 3s".
 * @param time time in ms
 * @returns string representation of the time
 */
export function parseTimeToString(time: number): string {
  let timeString = ``
  const timeInSeconds = time / 1000
  const hours = Math.floor(timeInSeconds / 3600)
  if (hours > 0) {
    timeString += `${hours}h `
  }
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  if (minutes > 0) {
    timeString += `${minutes}m `
  }
  const seconds = (timeInSeconds % 60).toFixed(hours === 0 && minutes === 0 ? 1 : 0)
  timeString += `${seconds}s`

  return timeString
}

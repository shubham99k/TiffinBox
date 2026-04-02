const toCutoffDate = (cutoffTime) => {
  const [hours, minutes] = cutoffTime.split(':').map(Number)
  const cutoff = new Date()
  cutoff.setHours(hours, minutes, 0, 0)
  return cutoff
}

export const isCutoffPassed = (cutoffTime) => {
  return new Date() > toCutoffDate(cutoffTime)
}

export const isCutoffInPast = (cutoffTime) => {
  return toCutoffDate(cutoffTime) <= new Date()
}

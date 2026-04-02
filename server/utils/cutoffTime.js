const BUSINESS_TIME_ZONE = 'Asia/Kolkata'

const getNowMinutesInIST = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date())

  const hours = Number(parts.find(part => part.type === 'hour')?.value || 0)
  const minutes = Number(parts.find(part => part.type === 'minute')?.value || 0)
  return hours * 60 + minutes
}

const toCutoffMinutes = (cutoffTime) => {
  const [hours, minutes] = cutoffTime.split(':').map(Number)
  return hours * 60 + minutes
}

export const isCutoffPassed = (cutoffTime) => {
  return getNowMinutesInIST() > toCutoffMinutes(cutoffTime)
}

export const isCutoffInPast = (cutoffTime) => {
  return getNowMinutesInIST() >= toCutoffMinutes(cutoffTime)
}

// NOTE(kevan): need to slice because the format from API is yyyy-mm-ddThh:mm:ssZ (based on stein.efishery.com API)
export const formatToISOString = (date: Date): string => date.toISOString().slice(0, -5) + 'Z'

export const formatToTimestamp = (date: Date): string => date.getTime().toString()

export const generateTglParsedTimestamp = (date: Date = new Date()): [string, string] => {
  return [formatToISOString(date), formatToTimestamp(date)]
}

export const formatLocaleDateString = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

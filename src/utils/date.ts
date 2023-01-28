// NOTE(kevan): need to slice because the format from API is yyyy-mm-ddThh:mm:ssZ (based on stein.efishery.com API)
export const formatToISOString = (date: Date): string => date.toISOString().slice(0, -5) + 'Z'

export const formatToTimestamp = (date: Date): string => date.getTime().toString()

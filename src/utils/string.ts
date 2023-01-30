export const capitalizeEachWord = (str: string): string => {
  if (!str) return ''
  const words = str.split(' ')
  const capitalizedWords = words.map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
  return capitalizedWords.join(' ')
}

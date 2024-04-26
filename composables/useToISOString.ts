export const useToISOString = (date: Date): string => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString()
}

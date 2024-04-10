export const useTOISOString = (date : Date) : string => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString()
}

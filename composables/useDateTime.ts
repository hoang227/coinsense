export const useDateTime = (date : Date) => {
  return useToISOString(date).split('T')[0]
}

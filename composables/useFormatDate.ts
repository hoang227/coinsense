export const useFormatDate = (dateString : string) : string => {
  const options : any = { day: 'numeric', month: 'long', year: 'numeric' }
  const dateParts = dateString.split('-')
  const year = parseInt(dateParts[0])
  const month = parseInt(dateParts[1]) - 1
  const day = parseInt(dateParts[2])

  const formattedDate = new Date(year, month, day).toLocaleDateString('en-GB', options)
  return formattedDate
}

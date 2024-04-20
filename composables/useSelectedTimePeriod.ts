export const useSelectedTimePeriod = (period : { month: number, year: string }) : { current: Ref<TimePeriod>, previous: Ref<TimePeriod> } => {
  const current = computed<TimePeriod>(() => {
    if (!period.month) {
      const from = new Date(period.year)
      const to = new Date((parseInt(period.year) + 1).toString())

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    } else {
      const from = new Date(parseInt(period.year), period.month - 1, 1)
      const to = new Date(parseInt(period.year), period.month, 1)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    }
  })
  const previous = computed<TimePeriod>(() => {
    if (!period.month) {
      const from = new Date((parseInt(period.year) - 1).toString())
      const to = new Date(period.year)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    } else {
      const from = new Date(parseInt(period.year), period.month - 2, 1)
      const to = new Date(parseInt(period.year), period.month - 1, 1)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    }
  })
  return { current, previous }
}

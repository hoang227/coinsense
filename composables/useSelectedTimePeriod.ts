export const useSelectedTimePeriod = (period: {
  month: number
  year: number
}): { current: Ref<TimePeriod>; previous: Ref<TimePeriod> } => {
  const current = computed<TimePeriod>(() => {
    if (period.month === -1) {
      const from = new Date(period.year, 0)
      const to = new Date(period.year + 1, 0)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    } else {
      const from = new Date(period.year, period.month, 1)
      const to = new Date(period.year, period.month + 1, 1)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    }
  })
  const previous = computed<TimePeriod>(() => {
    if (period.month === -1) {
      const from = new Date(period.year - 1, 0)
      const to = new Date(period.year, 0)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    } else {
      const from = new Date(period.year, period.month - 1, 1)
      const to = new Date(period.year, period.month, 1)

      to.setDate(to.getDate() - 1)

      return {
        from,
        to
      }
    }
  })
  return { current, previous }
}

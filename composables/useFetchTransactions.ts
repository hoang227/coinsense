export const useFetchTransactions = (current: Ref<TimePeriod>, previous: Ref<TimePeriod>) => {
  const currTransactions = ref<Transaction[]>([])
  const prevTransactions = ref<Transaction[]>([])
  const loading = ref(false)

  const firstFetch = async () => {
    loading.value = true
    try {
      const tempData = await useFetchFromDB(current, previous)
      currTransactions.value = tempData.currData
      prevTransactions.value = tempData.prevData
    } finally {
      loading.value = false
    }
  }

  const refresh = async (state : { month: number, year: number}) => {
    const { current: curr, previous: prev } = useSelectedTimePeriod(state)
    loading.value = true
    try {
      const tempData = await useFetchFromDB(curr, prev)
      currTransactions.value = tempData.currData
      prevTransactions.value = tempData.prevData
    } finally {
      loading.value = false
    }
  }

  const transactionsGroupedByDate = computed(() => {
    const grouped = {} as Record<string, Transaction[]>

    for (const transaction of currTransactions.value) {
      if (transaction) {
        const date = transaction.created_at?.split('T')[0] as string

        if (!grouped[date]) {
          grouped[date] = []
        }

        grouped[date].push(transaction)
      }
    }

    return grouped
  })

  const analytics = computed(() => useGetAnalytics(currTransactions.value, prevTransactions.value))

  return {
    currTransactions: {
      grouped: {
        byDate: transactionsGroupedByDate
      }
    },
    firstFetch,
    refresh,
    loading,
    analytics
  }
}

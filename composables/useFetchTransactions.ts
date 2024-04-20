export const useFetchTransactions = (current: Ref<TimePeriod>, previous: Ref<TimePeriod>) => {
  const supabase = useSupabaseClient()
  const currTransactions = ref<Transaction[]>([])
  const prevTransactions = ref<Transaction[]>([])
  const loading = ref(false)

  const timePeriod = useTimePeriodStore()

  const fetchTransactions = async () => {
    loading.value = true

    try {
      const { data } = await useAsyncData(`transactions=${current.value.from.toDateString()}-${current.value.to.toDateString()}`, async () => {
        const { data: currData, error: currError } = await supabase
          .from('transactions')
          .select()
          .gte('created_at', useToISOString(current.value.from))
          .lte('created_at', useToISOString(current.value.to))
          .order('created_at', { ascending: false })

        const { data: prevData, error: prevError } = await supabase
          .from('transactions')
          .select()
          .gte('created_at', useToISOString(previous.value.from))
          .lte('created_at', useToISOString(previous.value.to))
          .order('created_at', { ascending: false })

        if (currError || prevError) { return [] }

        return { currData, prevData }
      })
      return data.value as { currData: Transaction[], prevData: Transaction[] }
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    console.log(current.value)
    console.log(previous.value)
    const tempData = await fetchTransactions()
    currTransactions.value = tempData.currData
    prevTransactions.value = tempData.prevData
  }

  watch(timePeriod.$state, async () => await refresh())

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
    refresh,
    loading,
    analytics
  }
}

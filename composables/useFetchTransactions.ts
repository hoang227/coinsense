export const useFetchTransactions = (current: Ref<TimePeriod>, previous: Ref<TimePeriod>) => {
  const supabase = useSupabaseClient()
  const currTransactions = ref<Transaction[]>([])
  const prevTransactions = ref<Transaction[]>([])
  const pending = ref(false)

  const currIncome = computed(() => currTransactions.value.filter(t => t.type === 'income'))
  const currExpense = computed(() => currTransactions.value.filter(t => t.type === 'expense'))
  const currSavings = computed(() => currTransactions.value.filter(t => t.type === 'savings'))
  const currInvestment = computed(() => currTransactions.value.filter(t => t.type === 'investment'))

  const prevIncome = computed(() => prevTransactions.value.filter(t => t.type === 'income'))
  const prevExpense = computed(() => prevTransactions.value.filter(t => t.type === 'expense'))
  const prevSavings = computed(() => prevTransactions.value.filter(t => t.type === 'savings'))
  const prevInvestment = computed(() => prevTransactions.value.filter(t => t.type === 'investment'))

  const currIncomeCount = computed(() => currIncome.value.length)
  const currExpenseCount = computed(() => currExpense.value.length)
  const currSavingsCount = computed(() => currSavings.value.length)
  const currInvestmentCount = computed(() => currInvestment.value.length)

  const currIncomeTotal = computed(() => {
    return currIncome.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const currExpenseTotal = computed(() => {
    return currExpense.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const currSavingsTotal = computed(() => {
    return currSavings.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const currInvestmentTotal = computed(() => {
    return currInvestment.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const prevIncomeTotal = computed(() => {
    return prevIncome.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const prevExpenseTotal = computed(() => {
    return prevExpense.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const prevSavingsTotal = computed(() => {
    return prevSavings.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const prevInvestmentTotal = computed(() => {
    return prevInvestment.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })

  const fetchTransactions = async () => {
    pending.value = true

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
      pending.value = false
    }
  }

  const refresh = async () => {
    const tempData = await fetchTransactions()
    currTransactions.value = tempData.currData
    prevTransactions.value = tempData.prevData
  }

  watch(current, async () => await refresh())

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

  return {
    currTransactions: {
      all: currTransactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      currIncomeCount,
      currExpenseCount,
      currSavingsCount,
      currInvestmentCount,
      currIncomeTotal,
      currExpenseTotal,
      currSavingsTotal,
      currInvestmentTotal
    },
    prevTransactions: {
      prevIncomeTotal,
      prevExpenseTotal,
      prevSavingsTotal,
      prevInvestmentTotal
    },
    refresh,
    pending
  }
}

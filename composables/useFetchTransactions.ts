export const useFetchTransactions = () => {
  const supabase = useSupabaseClient()
  const transactions = ref<Transaction[]>([])
  const pending = ref(false)

  const income = computed(() => transactions.value.filter(t => t.type === 'income'))
  const expense = computed(() => transactions.value.filter(t => t.type === 'expense'))
  const savings = computed(() => transactions.value.filter(t => t.type === 'savings'))
  const investment = computed(() => transactions.value.filter(t => t.type === 'investment'))

  const incomeCount = computed(() => income.value.length)
  const expenseCount = computed(() => expense.value.length)
  const savingsCount = computed(() => savings.value.length)
  const investmentCount = computed(() => investment.value.length)

  const incomeTotal = computed(() => {
    return income.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const expenseTotal = computed(() => {
    return expense.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const savingsTotal = computed(() => {
    return savings.value.reduce((sum, transaction) => {
      if (transaction.amount !== undefined) {
        return sum + transaction.amount
      } else {
        return sum
      }
    }, 0)
  })
  const investmentTotal = computed(() => {
    return investment.value.reduce((sum, transaction) => {
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
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .order('created_at', { ascending: false })

      if (error) { return [] }

      return data
    } finally {
      pending.value = false
    }
  }

  const refresh = async () => { transactions.value = await fetchTransactions() }

  const transactionsGroupedByDate = computed(() => {
    const grouped = {} as Record<string, Transaction[]>

    for (const transaction of transactions.value) {
      if (transaction) {
        const date = (new Date(transaction.created_at ?? 0)).toISOString().split('T')[0]

        if (!grouped[date]) {
          grouped[date] = []
        }

        grouped[date].push(transaction)
      }
    }

    return grouped
  })

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      savings,
      investment,
      incomeCount,
      expenseCount,
      savingsCount,
      investmentCount,
      incomeTotal,
      expenseTotal,
      savingsTotal,
      investmentTotal
    },
    refresh,
    pending
  }
}

export const useFetchTransactions = () => {
  const supabase = useSupabaseClient()
  const transactions = ref([])
  const pending = ref(false)

  const income = computed(() => transactions.filter(t => t.type === 'income'))
  const expense = computed(() => transactions.filter(t => t.type === 'expense'))
  const savings = computed(() => transactions.filter(t => t.type === 'savings'))
  const investment = computed(() => transactions.filter(t => t.type === 'investment'))

  const incomeCount = computed(() => income.value.length())
  const expenseCount = computed(() => expense.value.length())
  const savingsCount = computed(() => savings.value.length())
  const investmentCount = computed(() => investment.value.length())

  const incomeTotal = computed(() => income.value.reduce((sum, transaction) => sum + transaction.amount), 0)
  const expenseTotal = computed(() => expense.value.reduce((sum, transaction) => sum + transaction.amount), 0)
  const savingsTotal = computed(() => savings.value.reduce((sum, transaction) => sum + transaction.amount), 0)
  const investmentTotal = computed(() => investment.value.reduce((sum, transaction) => sum + transaction.amount), 0)

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
    const grouped = {}

    for (const transaction of transactions.value) {
      const date = transaction.created_at

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(transaction)
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

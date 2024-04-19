export const useGetAnalytics = (currTransactions: Transaction[], prevTransactions: Transaction[])
  : {
    currAnalytics: Record<string, Record<string, number>>,
    prevAnalytics: Record<string, Record<string, number>>,
    accounts: string[]
  } => {
  // calculate the income and expenses for each account

  // console.log(currTransactions)
  // console.log(prevTransactions)

  const currByAccount = {} as Record<string, Transaction[]>
  const prevByAccount = {} as Record<string, Transaction[]>

  for (const transaction of currTransactions) {
    if (transaction) {
      const account = transaction.account
      if (!currByAccount[account]) {
        currByAccount[account] = []
      }

      currByAccount[account].push(transaction)
    }
  }

  for (const transaction of prevTransactions) {
    if (transaction) {
      const account = transaction.account
      if (!prevByAccount[account]) {
        prevByAccount[account] = []
      }

      prevByAccount[account].push(transaction)
    }
  }

  // console.log('curr before', currByAccount)
  // console.log('prev before', prevByAccount)

  const currAccounts = Object.keys(currByAccount)
  const prevAccounts = Object.keys(prevByAccount)

  const allAccounts = [...currAccounts, ...prevAccounts]

  const accounts = Array.from(new Set(allAccounts))

  for (const account of accounts) {
    if (!currByAccount[account]) {
      currByAccount[account] = []
    }
    if (!prevByAccount[account]) {
      prevByAccount[account] = []
    }
  }

  // console.log('curr after', currByAccount)
  // console.log('prev after', prevByAccount)

  // split all transactions into income and expense transactions
  const currByAccountThenType = {} as Record<string, Record<string, Transaction[]>>
  const prevByAccountThenType = {} as Record<string, Record<string, Transaction[]>>

  for (const [account, transactions] of Object.entries(currByAccount)) {
    const currAccount = {
      income: [] as Transaction[],
      expense: [] as Transaction[]
    } as Record<string, Transaction[]>

    for (const transaction of transactions) {
      if (transaction.type === 'income') {
        currAccount.income.push(transaction)
      } else {
        currAccount.expense.push(transaction)
      }
    }
    currByAccountThenType[account] = currAccount
  }

  for (const [account, transactions] of Object.entries(prevByAccount)) {
    const currAccount = {
      income: [] as Transaction[],
      expense: [] as Transaction[]
    } as Record<string, Transaction[]>

    for (const transaction of transactions) {
      if (transaction.type === 'income') {
        currAccount.income.push(transaction)
      } else {
        currAccount.expense.push(transaction)
      }
    }
    prevByAccountThenType[account] = currAccount
  }

  // console.log(currByAccountThenType)
  // console.log(prevByAccountThenType)

  const currByAccountThenTypeTotal = {} as Record<string, Record<string, number>>
  const prevByAccountThenTypeTotal = {} as Record<string, Record<string, number>>

  for (const [account, transactions] of Object.entries(currByAccountThenType)) {
    const currAccount = {
      income: 0,
      expense: 0
    } as Record<string, number>

    currAccount.income = transactions.income.reduce((sum, transaction) => sum + transaction.amount, 0)
    currAccount.expense = transactions.expense.reduce((sum, transaction) => sum + transaction.amount, 0)

    currByAccountThenTypeTotal[account] = currAccount
  }

  for (const [account, transactions] of Object.entries(prevByAccountThenType)) {
    const currAccount = {
      income: 0,
      expense: 0
    } as Record<string, number>

    currAccount.income = transactions.income.reduce((sum, transaction) => sum + transaction.amount, 0)
    currAccount.expense = transactions.expense.reduce((sum, transaction) => sum + transaction.amount, 0)

    prevByAccountThenTypeTotal[account] = currAccount
  }

  return {
    currAnalytics: currByAccountThenTypeTotal,
    prevAnalytics: prevByAccountThenTypeTotal,
    accounts
  }
}

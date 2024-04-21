export const useAccountsStore = defineStore({
  id: 'time-period',
  state: () => ({
    accounts: ['account1', 'account2'] as string[]
  }),
  getters: {
    getAccounts: state => state.accounts,
    getCount: state => state.accounts.length
  },
  actions: {
    addAccount (account : string | string[]) {
      if (typeof account === 'string') {
        this.accounts.push(account)
      } else {
        this.accounts.push(...account)
      }
    },
    removeAccount (account : string) {
      this.accounts = this.accounts.filter(item => item !== account)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountsStore, import.meta.hot))
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const { toastSuccess, toastError } = useAppToast()

export const useAccountsStore = defineStore({
  id: 'accounts',
  state: () => ({
    accounts: user.value?.user_metadata.accounts
  }),
  getters: {
    getAccounts: state => state.accounts,
    getCount: state => state.accounts.length
  },
  actions: {
    async addAccount(account: string | string[]) {
      loading.value = true
      try {
        const newAccounts: string[] = user.value?.user_metadata.accounts

        if (Array.isArray(account)) {
          for (const acc in account) {
            if (newAccounts.includes(acc)) {
              throw new Error('Account already exists.')
            }
          }
        }

        if (newAccounts.includes(account as string)) {
          throw new Error('Account already exists.')
        }

        if (Array.isArray(account)) {
          newAccounts.push(...account)
        } else {
          newAccounts.push(account)
        }

        this.accounts = newAccounts

        const { error } = await supabase.auth.updateUser({
          data: {
            accounts: newAccounts
          }
        })

        if (error) {
          throw error
        }

        navigateTo('/settings/settings')

        toastSuccess({
          title: 'Account added'
        })
      } catch (error) {
        toastError({
          title: 'Error adding account',
          description: (error as Error).message
        })
      } finally {
        loading.value = false
      }

      return loading
    },
    async removeAccount(account: string) {
      loading.value = true
      try {
        const newAccounts: string[] = user.value?.user_metadata.accounts.filter(
          (item: string) => item !== account
        )

        this.accounts = newAccounts

        const { error } = await supabase.auth.updateUser({
          data: {
            accounts: newAccounts
          }
        })

        if (error) {
          throw error
        }

        navigateTo('/settings/settings')

        toastSuccess({
          title: 'Account removed'
        })
      } catch (error) {
        toastError({
          title: 'Error removing account',
          description: (error as Error).message
        })
      } finally {
        loading.value = false
      }

      return loading
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountsStore, import.meta.hot))
}

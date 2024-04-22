const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const { toastSuccess, toastError } = useAppToast()

export const useAccountsStore = defineStore({
  id: 'accounts',
  state: () => ({
    accounts: [] as string[]
  }),
  getters: {
    getAccounts: state => state.accounts,
    getCount: state => state.accounts.length
  },
  actions: {
    initStore () {
      this.accounts = user.value?.user_metadata.accounts
    },
    closeStore () {
      this.accounts = [] as string[]
    },
    async addAccount (account : string | string[]) {
      loading.value = true
      try {
        const newAccounts : string[] = user.value?.user_metadata.accounts
        if (typeof account === 'string') {
          newAccounts.push(account)
        } else {
          newAccounts.push(...account)
        }

        const { error } = await supabase
          .auth
          .updateUser({
            data: {
              accounts: newAccounts
            }
          })

        if (error) { throw error }

        this.accounts = user.value?.user_metadata.accounts

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
    async removeAccount (account : string) {
      loading.value = true
      try {
        const newAccounts : string[] = user.value?.user_metadata.accounts
          .filter((item : string) => item !== account)

        const { error } = await supabase
          .auth
          .updateUser({
            data: {
              accounts: newAccounts
            }
          })

        if (error) { throw error }

        this.accounts = user.value?.user_metadata.accounts

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

export const useTimePeriodStore = defineStore({
  id: 'time-period',
  state: () => ({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }),
  getters: {
    getMonth: state => state.month,
    getYear: state => state.year,
    getState: (state) => {
      return {
        month: state.month,
        year: state.year
      }
    }
  },
  actions: {
    setMonth (month : number) {
      this.month = month
    },
    setYear (year : number) {
      this.year = year
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTimePeriodStore, import.meta.hot))
}

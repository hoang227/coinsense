export const useTimePeriodStore = defineStore({
  id: 'time-period',
  state: () => ({ month: (new Date().getMonth()).toString(), year: new Date().getFullYear().toString() }),
  getters: {
    getMonth: state => parseInt(state.month),
    getYear: state => state.year,
    getState: (state) => {
      return {
        month: parseInt(state.month),
        year: state.year
      }
    }
  },
  actions: {
    setMonth (month : string) {
      this.month = month
    },
    setYear (year : string) {
      this.year = year
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTimePeriodStore, import.meta.hot))
}

import { defineStore } from 'pinia'

export const useTimePeriodStore = defineStore({
  id: 'time-period',
  state: () => ({ month: (new Date().getMonth() + 1).toString(), year: new Date().getFullYear().toString() }),
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

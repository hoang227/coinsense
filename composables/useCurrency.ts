export const useCurrency = (amount : number | Ref<number>) => {
  const currency = computed(() => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(isRef(amount) ? amount.value : amount)
  })

  return {
    currency
  }
}

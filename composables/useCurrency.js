export const useCurrency = (amount) => {
  const currency = computed(() => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumIntegerDigits: 2,
      maximumIntegerDigits: 2
    }).format(isRef(amount) ? amount.value : amount)
  })

  return {
    currency
  }
}

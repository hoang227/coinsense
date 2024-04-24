export const useCurrency = (amount : number | Ref<number>) => {
  return {
    currency: new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(isRef(amount) ? amount.value : amount).split('$')[1]
  }
}

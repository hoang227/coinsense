export const useFetchFromDB = async (
  current: Ref<TimePeriod>,
  previous: Ref<TimePeriod>
) => {
  const supabase = useSupabaseClient()
  const { data } = await useAsyncData(
    `transactions=${current.value.from.toDateString()}-${current.value.to.toDateString()}`,
    async () => {
      const { data: currData, error: currError } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', useToISOString(current.value.from))
        .lte('created_at', useToISOString(current.value.to))
        .order('created_at', { ascending: false })

      const { data: prevData, error: prevError } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', useToISOString(previous.value.from))
        .lte('created_at', useToISOString(previous.value.to))
        .order('created_at', { ascending: false })

      if (currError || prevError) {
        return []
      }

      const currDataWithTags = currData.map((transaction: any) => {
        return {
          ...transaction,
          tags: useJsonToTags(transaction.tags)
        }
      })

      const prevDataWithTags = prevData.map((transaction: any) => {
        return {
          ...transaction,
          tags: useJsonToTags(transaction.tags)
        }
      })

      return { currData: currDataWithTags, prevData: prevDataWithTags }
    }
  )
  return data.value as { currData: Transaction[]; prevData: Transaction[] }
}

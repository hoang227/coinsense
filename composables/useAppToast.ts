export const useAppToast = () => {
  const toast = useToast()

  const res = {
    toastSuccess: ({ title, description } : { title: string, description?: string }) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    },
    toastError: ({ title, description } : { title: string, description?: string }) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }

  return res
}

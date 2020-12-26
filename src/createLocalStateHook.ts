import produce, { Draft } from 'immer'
import useSwr, { ConfigInterface } from 'swr'

export const createLocalStateHook = <D, E>(key: string, options: ConfigInterface<D, E>) => () => {
  const { data, mutate } = useSwr<D, E>(key, {
    ...options,
    suspense: true,
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  })

  return {
    data,
    mutate(mutateCallback: (draft: Draft<D> | undefined) => void) {
      return mutate((state = options.initialData) => {
        return produce<D | undefined>(state, mutateCallback)
      }, false)
    },
  }
}

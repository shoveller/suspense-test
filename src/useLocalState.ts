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

  return { data, mutate }
}

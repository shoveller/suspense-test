import produce, { Draft } from 'immer'
import useSwr, { ConfigInterface } from 'swr'

interface IConfigInterface<IData, IError> extends ConfigInterface<IData, IError> {
  initialData: IData
}

export const createLocalStateHook = <IData, IError>(
  key: string,
  options: IConfigInterface<IData, IError>,
) => () => {
  const { data, mutate } = useSwr<IData, IError>(key, {
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
    mutate(mutateCallback: (draft: Draft<IData>) => void) {
      return mutate((state: IData = options.initialData) => {
        return produce<IData>(state, mutateCallback)
      }, false)
    },
  }
}

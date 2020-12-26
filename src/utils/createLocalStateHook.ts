import produce, { Draft } from 'immer'
import useSwr, { ConfigInterface } from 'swr'

interface IConfigInterface<IData, IError> extends ConfigInterface<IData, IError> {
  initialData: IData
}

/**
 * 자체 개발한 로컬 상태 관리용 훅 제네레이터
 * @param key
 * @param options
 */
export const createLocalStateHook = <IData, IError extends Error>(
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

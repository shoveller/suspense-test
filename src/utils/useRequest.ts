import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useSWR, { ConfigInterface, responseInterface } from 'swr'

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
  extends Pick<
    responseInterface<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'revalidate' | 'error' | 'mutate'
  > {
  data: Data | undefined
  response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<ConfigInterface<AxiosResponse<Data>, AxiosError<Error>>, 'initialData'> {
  initialData?: Data
}

/**
 * 예제에서 추출한 axios의 swr 인티크레이션
 * @url https://github.com/vercel/swr/blob/master/examples/axios-typescript/pages/index.tsx
 * @param request
 * @param initialData
 * @param config
 */
export const useRequest = <Data = unknown, Error = unknown>(
  request: GetRequest,
  { initialData, ...config }: Config<Data, Error> = {},
): Return<Data, Error> => {
  const { data: response, error, isValidating, revalidate, mutate } = useSWR<
    AxiosResponse<Data>,
    AxiosError<Error>
  >(
    request && JSON.stringify(request),
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => axios(request!),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config: request!,
        headers: {},
        data: initialData,
      },
    },
  )

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    revalidate,
    mutate,
  }
}

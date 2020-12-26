import axios, { AxiosRequestConfig } from 'axios'

const cancelSource = axios.CancelToken.source()

const axiosInstance = axios.create({
  cancelToken: cancelSource.token,
})

export const axiosFetcher = (url: string, options?: AxiosRequestConfig) => {
  return axiosInstance.get(url, options)
}

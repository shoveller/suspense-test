import useSwr from 'swr'

export const isTruthy = (value: unknown) => value !== undefined && value !== null

export const useLocalState = <T>(key: string, initialState: T) => {
  const { data, mutate } = useSwr(key, () => {
    const item = sessionStorage.getItem(key)
    if (isTruthy(item)) {
	    return JSON.parse(item as string) as T
    }

	  sessionStorage.setItem(key, JSON.stringify(initialState))

	  return initialState
  })

  return {
    data,
    mutate: (cb: (state: T) => T) => {
    	if (isTruthy(data)) {
		    const newState = cb(data as T)
		    if (isTruthy(newState)) {
			    sessionStorage.setItem(key, JSON.stringify(newState))
		    }
	    }

      return mutate()
    },
  }
}

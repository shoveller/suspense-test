import { ErrorBoundary } from 'ErrorBoundary'
import React, { Suspense } from 'react'
import useSwr from 'swr'

const FailFallBack = () => <div>통신 실패</div>

const LoadingFallBack = () => <div>로딩중...</div>

const useLocalState = (key: string, initialState?: any) => {
  const { data, mutate } = useSwr(key, () => {
    const item = sessionStorage.getItem(key)
    if (!item) return

    return JSON.parse(item)
  })

  return {
    data,
    mutate: (cb: (state: any) => any) => {
      const item = cb(data)
      if (item) {
        sessionStorage.setItem(key, JSON.stringify(item))
      }

      return mutate()
    },
  }
}

const DataPane = () => {
  const { data } = useLocalState('SwrLocal', 0)

  return <div>{data}</div>
}

const PlusButton = () => {
  const { mutate } = useLocalState('SwrLocal', 0)

  return <button onClick={async () => await mutate((state) => state + 1)}>+</button>
}

const MinusButton = () => {
  const { mutate } = useLocalState('SwrLocal', 0)

  return <button onClick={async () => await mutate((state) => state - 1)}>-</button>
}

const SwrLocal = () => {
  return (
    <>
      <p>
        {'SWR은 ErrorBoundary 와 Suspense 를 온전히 활용할 수 있는 유일한 promise wrapper입니다.'}
      </p>
      <p>SWR은 서버와 클라이언트의 상태를 동기화 하는데 특화되어 있습니다.</p>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <DataPane />
          <PlusButton />
          <MinusButton />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default SwrLocal

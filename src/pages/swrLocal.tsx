import { ErrorBoundary } from 'ErrorBoundary'
import React, { Suspense, useCallback } from 'react'
import { createLocalStateHook } from 'useLocalState'

const FailFallBack = () => <div>통신 실패</div>

const LoadingFallBack = () => <div>로딩중...</div>

const useSwrLocalState = createLocalStateHook('SwrLocal', { count: 0, dummy: '야호' })

const DataPane = () => {
  const { data } = useSwrLocalState()

  return <div>{data?.count}</div>
}

const DummyPane = () => {
  const { data } = useSwrLocalState()

  return <div>{data?.dummy}</div>
}

const PlusButton = () => {
  const { mutate } = useSwrLocalState()
  const onClick = useCallback(
    () =>
      mutate((state) => {
        return {
          ...state,
          count: state.count + 1,
        }
      }),
    [mutate],
  )

  return <button onClick={onClick}>+</button>
}

const MinusButton = () => {
  const { mutate } = useSwrLocalState()
  const onClick = useCallback(
    () =>
      mutate((state) => {
        return {
          ...state,
          count: state.count - 1,
        }
      }),
    [mutate],
  )

  return <button onClick={onClick}>-</button>
}

const SwrLocal = () => {
  return (
    <>
      <p>SWR로 로컬 상태를 제어하는 예제입니다.</p>
      <p>ContextAPI와 마찬가지로 불필요한 렌더링이 늘어나는 단점이 있습니다.</p>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <DataPane />
          <DummyPane />
          <PlusButton />
          <MinusButton />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default SwrLocal

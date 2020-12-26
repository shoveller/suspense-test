import SWRDevtools from '@jjordy/swr-devtools'
import { createLocalStateHook } from 'createLocalStateHook'
import { ErrorBoundary } from 'ErrorBoundary'
import React, { Suspense } from 'react'
import { cache, mutate } from 'swr'

const FailFallBack = () => <div>통신 실패</div>

const LoadingFallBack = () => <div>로딩중...</div>

/**
 * 관심사에 따라 분리된 컴퍼넌트들이 사용하기 위한 customHook
 */
const initialData = { count: 0, dummy: '야호' }

const useSwrLocalState = createLocalStateHook('SwrLocal', {
  initialData,
})

const DataPane = () => {
  const { data = initialData } = useSwrLocalState()

  return <div>{data.count}</div>
}

const DummyPane = () => {
  const { data = initialData } = useSwrLocalState()

  return <div>{data.dummy}</div>
}

const PlusButton = () => {
  const { mutate } = useSwrLocalState()
  const onClick = () =>
    mutate((data) => {
      data.count = data.count + 1
    })

  return <button onClick={onClick}>+</button>
}

const MinusButton = () => {
  const { mutate } = useSwrLocalState()
  const onClick = () =>
    mutate((data) => {
      data.count = data.count - 1
    })

  return <button onClick={onClick}>-</button>
}

const SwrLocal = () => {
  return (
    <>
      <SWRDevtools cache={cache} mutate={mutate} />
      <p>SWR로 로컬 상태를 제어하는 예제입니다.</p>
      <p>
        SWR은 내부에 캐시를 가지고 있기 때문에 별다른 수정 없이 state tree 대용으로 사용할 수
        있습니다.
      </p>
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

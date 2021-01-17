import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense } from 'react'
import useSwr from 'swr'
import { fakeApi } from 'utils/fakeApi'

const DataPane = () => {
  const { data } = useSwr('출력을 원하는 값', fakeApi)

  return <div>{data}</div>
}

const Swr = () => {
  return (
    <>
      <p>
        SWR은 ErrorBoundary 와 Suspense 를 온전히 활용할 수 있는 promise wrapper를 내장하고 있습니다.
      </p>
      <p>react query와 recoil도 비슷한 목적을 이루기 위해 만들어진 것입니다.</p>
      <p>SWR은 서버와 클라이언트의 상태를 동기화 하는데 특화되어 있습니다.</p>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <DataPane />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Swr

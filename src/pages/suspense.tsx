import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense } from 'react'
import { fakeApi } from 'utils/fakeApi'

/**
 * promise를 throw 할 수 있도록 시범적으로 구현된 래퍼입니다.
 * @param promise
 */
const wrapPromise = (promise: Promise<string>) => {
  let data: string | Error
  let status = 'pending'
  const suspense = promise.then(
    (result) => {
      status = 'resolved'
      data = result
    },
    (error: Error) => {
      status = 'rejected'
      data = error
    },
  )

  return () => {
    if (status === 'pending') {
      // 대기중이면 promise를 throw
      throw suspense
    }
    if (status === 'rejected') {
      // 실패하면 응답을 throw
      throw data
    }
    if (status === 'resolved') {
      // 성공하면 결과를 return
      return data
    }
  }
}

const api = wrapPromise(fakeApi('출력할 데이터'))

const DataPane = () => {
  const data = api()

  return <>{data}</>
}

const SuspenseTestPage = () => {
  return (
    <>
      <p>Suspense는 Promise를 잡아내는 ErrorBoundary 입니다.</p>
      <p>
        Suspense의 하위 컴포넌트가 Promise를 throw 하면, Suspense 에 fallback으로 설정한 컴포넌트를
        표시합니다.
      </p>
      <p>이 기능을 사용하려면, 대기중일 때 promise를 throw 하는 메커니즘을 갖춰야 합니다.</p>
      <p>현재 사용중인 wrapPromise 구현은 프로덕션에서 사용할 수 없습니다.</p>
      <Suspense fallback={<LoadingFallBack />}>
        <DataPane />
      </Suspense>
    </>
  )
}

export default SuspenseTestPage

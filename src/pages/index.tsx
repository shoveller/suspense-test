import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import React from 'react'

const InvalidComponent = () => {
  const a = {}

  return <>{a[1][1]}</>
}

const ErrorBoundaryTestPage = () => {
  return (
    <>
      <p>ErrorBoundary는 children 컴포넌트에서 발생한 예외를 잡아내는 컴포넌트입니다.</p>
      <p>react.js는 원래 런타임에 예외가 발생하면 전체 컴포넌트를 지웁니다.</p>
      <p>
        ErrorBoundary의 children 컴포넌트에서 예외가 발생하면, 지정한 컴포넌트를 대신 렌더링합니다.
      </p>
      <ErrorBoundary fallback={<FailFallBack />}>
        <InvalidComponent />
      </ErrorBoundary>
    </>
  )
}

export default ErrorBoundaryTestPage

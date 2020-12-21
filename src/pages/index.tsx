import { ErrorBoundary } from 'ErrorBoundary'
import React, { CSSProperties } from 'react'

const InvalidComponent = () => {
	const a = {}

	return <>{a[1][1]}</>
}

const FallBack = () => {
	const css: CSSProperties = {
		backgroundColor: 'red',
	}

	return <div style={css}>에러가 발생했습니다.</div>
}

const ErrorBoundaryTestPage = () => {
	return (
		<>
			<p>ErrorBoundary는 children 컴퍼넌트에서 발생한 예외를 잡아내는 컴퍼넌트입니다.</p>
			<p>react.js는 원래 런타임에 예외가 발생하면 전체 컴퍼넌트를 지웁니다.</p>
			<p>
				ErrorBoundary의 children 컴퍼넌트에서 예외가 발생하면, 지정한 컴퍼넌트를 대신
				렌더링합니다.
			</p>
			<ErrorBoundary fallback={<FallBack />}>
				<InvalidComponent />
			</ErrorBoundary>
		</>
	)
}

export default ErrorBoundaryTestPage

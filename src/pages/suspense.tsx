import React, { Suspense } from 'react'

const FallBack = () => <div>로딩중...</div>

const fakeApi = (value: string) => {
	return new Promise<string>((resolve) => {
		setTimeout(() => resolve(value), 5000)
	})
}

const safeCall = (promise: Promise<string>) => {
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
		}
	)

	return () => {
		if (status === 'pending') {
			throw suspense
		}
		if (status === 'rejected') {
			throw data
		}
		if (status === 'resolved') {
			return data
		}
	}
}

const api = safeCall(fakeApi('출력할 데이터'))

const DataPane = () => {
	const data = api()

	return <>{data}</>
}

const SuspenseTestPage = () => {
	return (
		<>
			<p>Suspense는 Promise를 잡아내는 ErrorBoundary 입니다.</p>
			<p>
				Suspense의 하위 컴퍼넌트가 Promise를 throw 하면, Suspense 에 fallback으로 설정한
				컴퍼넌트를 표시합니다.
			</p>
			<Suspense fallback={<FallBack />}>
				<DataPane />
			</Suspense>
		</>
	)
}

export default SuspenseTestPage

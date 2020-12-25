import { ErrorBoundary } from 'ErrorBoundary'
import React, { ReactNode, Suspense } from 'react'
import useSwr, { SWRConfig, ConfigInterface } from 'swr'

const FailFallBack = () => <div>통신 실패</div>

const LoadingFallBack = () => <div>로딩중...</div>

const fakeApi = (value: string) => {
	console.log('호출됨')
	return new Promise<string>((resolve) => {
		setTimeout(() => resolve(value + new Date().getTime()), 1000)
	})
}

const DataPane = () => {
	const { data } = useSwr('출력을 원하는 값', fakeApi)

	return <div>{data}</div>
}

const SWRConfigProvider = ({ children }: { children: ReactNode }) => {
	const value: ConfigInterface = {
		suspense: true,
		refreshInterval: 1000, // 리프레시 간격
		// refreshWhenOffline: true,
		onSuccess(data, key, config) {
			console.log('onSuccess', data, key, config)
		},
		compare(a, b) {
			return a === b
		},
	}

	return <SWRConfig value={value}>{children}</SWRConfig>
}

const Swr = () => {
	return (
		<SWRConfigProvider>
			<p>
				{
					'SWR은 ErrorBoundary 와 Suspense 를 온전히 활용할 수 있는 유일한 promise wrapper입니다.'
				}
			</p>
			<p>SWR은 서버와 클라이언트의 상태를 동기화 하는데 특화되어 있습니다.</p>
			<ErrorBoundary fallback={<FailFallBack />}>
				<Suspense fallback={<LoadingFallBack />}>
					<DataPane />
				</Suspense>
			</ErrorBoundary>
		</SWRConfigProvider>
	)
}

export default Swr

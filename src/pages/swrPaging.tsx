import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import { Suspense } from 'react'
import useSwr from 'swr'

const Table = () => {
  const { data } = useSwr('https://pokeapi.co/api/v2/pokemon')

  return <div>{JSON.stringify(data)}</div>
}

const SwrPaging = () => {
  return (
    <ErrorBoundary fallback={<FailFallBack />}>
      <Suspense fallback={<LoadingFallBack />}>
        <Table />
      </Suspense>
    </ErrorBoundary>
  )
}

export default SwrPaging

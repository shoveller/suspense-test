import SWRDevtools from '@jjordy/swr-devtools'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense } from 'react'
import useSwr, { cache, mutate } from 'swr'
import { IPokemon, INamedApiResourceList } from 'pokeapi-typescript'

const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init)

  return res.json()
}

interface IPaging {
  offset: number
  limit: number
}

const usePokemonRepository = () => {
  const initialData: IPaging = {
    offset: 0,
    limit: 5,
  }
  const paging = useSwr<IPaging>('paging', {
    initialData,
  })
  const searchParams = new URLSearchParams({ offset: `${paging?.data?.offset}`, limit: `${paging?.data?.limit}` })
  const url = new URL('/api/v2/pokemon', 'https://pokeapi.co')
  url.search = searchParams.toString()
  const { data, error } = useSwr<INamedApiResourceList<IPokemon>, Error>(url.toString(), fetcher, {
    fetcher,
    suspense: true,
  })

  return {
    url: url.toString(),
    data,
    error,
    paging: paging.data,
    async move(offset: number) {
      await paging.mutate((state = { limit: 5, offset: 0 }) => {
        return {
          limit: state.limit,
          offset: state.offset + offset
        }
      })
    },
  }
}

const Rows = () => {
  const { data } = usePokemonRepository()
  const rows = data?.results.map((item, index) => {
    return (
      <tr key={`row_${index}`}>
        <td>
          <a href='#'>{item.name}</a>
        </td>
      </tr>
    )
  })

  return <Suspense fallback={<h6>로딩중...</h6>}>{rows}</Suspense>
}

const Table = () => {
  return (
    <table>
      <tbody>
        <Rows />
      </tbody>
    </table>
  )
}

const Paginator = () => {
  const { move } = usePokemonRepository()

  return (
    <div>
      <button onClick={() => move(-5)}>이전</button>
      <button onClick={() => move(5)}>이후</button>
    </div>
  )
}

const SwrPaging = () => {
  return (
    <>
      <SWRDevtools cache={cache} mutate={mutate} />
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <Table />
          <Paginator />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default SwrPaging

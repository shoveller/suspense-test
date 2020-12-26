import SWRDevtools from '@jjordy/swr-devtools'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense, useState } from 'react'
import { cache, mutate } from 'swr'
import { useRequest } from 'utils/useRequest'

interface IPokemon {
  name: string
  url: string
}

interface IPokemonList {
  count: number
  next: string | null
  previous: string | null
  results: IPokemon[]
}

const useTestPaging = (
  params = {
    offset: 0,
    limit: 5,
  },
) => {
  const [pagingParam, setPagingParam] = useState(params)

  return useRequest<IPokemonList, Error>({
    baseURL: 'https://pokeapi.co/api/v2',
    url: 'pokemon',
    params: {
      offset: 0,
      limit: 5,
    },
  })
}

const Rows = () => {
  /**
   * swr은 default fetcher로도 작업을 할 수 있습니다.
   */
  // const { data } = useSwr<IPokemonList, Error>('https://pokeapi.co/api/v2/pokemon')
  /**
   * 아래의 예는 axios를 fetcher로 사용한 것입니다.
   */
  const { data } = useTestPaging()
  const rows = data?.results.map((item, index) => {
    return (
      <tr key={`row_${index}`}>
        <td>
          <a href={item.url}>{item.name}</a>
        </td>
      </tr>
    )
  })

  return <>{rows}</>
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

// const PrevButton = () => {
//   const { data, mutate } = useTestPaging()
//   if (!data?.previous) return <></>
//
//   const { searchParams } = new URL(data?.previous)
//   const offset = parseInt(searchParams.get('offset') || '5', 10)
//   const limit = parseInt(searchParams.get('limit') || '0', 10)
//
//   const pagingInfo = paginate(data?.count, limit)
//
//   const onClick = () => {}
//
//   return <button onClick={onClick}>이전</button>
// }

const Paginator = () => {
  console.log(cache)

  return (
    <div>
      <button>이전</button>
      <button>이후</button>
    </div>
  )
}

const SwrPaging = () => {
  return (
    <>
      <p>swr의 cache를 2개 이상의 컴퍼넌트와 공유하는 오피셜한 방법이 없다</p>
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

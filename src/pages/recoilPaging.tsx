import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense } from 'react'
import { atom, RecoilRoot, useRecoilValue } from 'recoil'

interface IPokemon {
  name: string
  url: string
}

interface IPokemonList {
  count: number | null
  next: string | null
  previous: string | null
  results: IPokemon[]
}

const pokemonList = atom<IPokemonList>({
  key: 'pokemonList',
  default: new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          count: null,
          next: null,
          previous: null,
          results: [],
        }),
      1000,
    )
  }),
})

// const useTestPaging = (
//   params = {
//     offset: 0,
//     limit: 5,
//   },
// ) => {
//   const [pagingParam, setPagingParam] = useState(params)
//
//   return useRequest<IPokemonList, Error>({
//     baseURL: 'https://pokeapi.co/api/v2',
//     url: 'pokemon',
//     params: {
//       offset: 0,
//       limit: 5,
//     },
//   })
// }

const Rows = () => {
  const data = useRecoilValue(pokemonList)
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
  return (
    <div>
      <button>이전</button>
      <button>이후</button>
    </div>
  )
}

const RecoilPaging = () => {
  return (
    <RecoilRoot>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <Table />
          <Paginator />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  )
}

export default RecoilPaging

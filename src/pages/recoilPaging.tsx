import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import React, { Suspense } from 'react'
import {
  atom,
  RecoilRoot,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

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

interface IPageParam extends Record<string, string> {
  offset: string
  limit: string
}

const pokemonListPageAtom = atom({
  key: 'pokemonListPagingAtom',
  default: 1,
})

const pokemonListPageSelector = selectorFamily<IPageParam, number>({
  key: 'pokemonListParamSelector',
  get: (limit) => ({ get }) => {
    const pageNo = get(pokemonListPageAtom)
    const offset = (pageNo - 1) * limit

    if (offset < 0) {
      return {
        offset: `0`,
        limit: `${limit}`,
      }
    }

    if (limit < 0) {
      return {
        offset: `${offset}`,
        limit: `0`,
      }
    }

    return {
      offset: `${offset}`,
      limit: `${limit}`,
    }
  },
})

const pokemonListSelector = selector<IPokemonList>({
  key: 'pokemonListSelector',
  async get({ get }) {
    const params = get(pokemonListPageSelector(5))
    const urlSearchParams = new URLSearchParams(params)
    const pokemonList: IPokemonList = await fetch(
      `https://pokeapi.co/api/v2/pokemon?${urlSearchParams}`,
    ).then((res) => res.json())

    return pokemonList
  },
})

const Rows = () => {
  const { results } = useRecoilValue(pokemonListSelector)
  const rows = results.map((item, index) => {
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

const Prev = () => {
  const [page, setPage] = useRecoilState(pokemonListPageAtom)
  if (page === 1) {
    return <></>
  }

  return <button onClick={() => setPage((page) => page - 1)}>이전페이지</button>
}

const Next = () => {
  const setPage = useSetRecoilState(pokemonListPageAtom)

  return <button onClick={() => setPage((page) => page + 1)}>다음페이지</button>
}

const Paginator = () => {
  return (
    <p>
      <Prev />
      <Next />
    </p>
  )
}

const RecoilPaging = () => {
  return (
    <RecoilRoot>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <Paginator />
          <Table />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  )
}

export default RecoilPaging

import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import {atom, Provider, useAtom, useAtomValue, useSetAtom} from "jotai"
import {atomFamily} from "jotai/utils"
import PokeAPI, { INamedApiResourceList, IPokemon } from 'pokeapi-typescript'
import React, { Suspense } from 'react'

interface IPageParam {
  offset: number
  limit: number
}

const pokemonListPageNo = atom(1)

const pokemonListPagingInfo = atomFamily((limit: number) => {
  return atom<IPageParam>((get) => {
    const pageNo = get(pokemonListPageNo)
    const offset = (pageNo - 1) * limit

    if (offset < 0) {
      return {
        offset: 0,
        limit,
      }
    }

    if (limit < 0) {
      return {
        offset,
        limit: 0,
      }
    }

    return {
      offset,
      limit,
    }
  })
})

const pokemonListSelector = atom(async (get) => {
  const { limit, offset } = get(pokemonListPagingInfo(5))
  const pokemonList = await PokeAPI.Pokemon.list(limit, offset)

  return {
    ...pokemonList,
    results: pokemonList.results.map((item) => {
      return {
        ...item,
        name: `${item.name}`,
      }
    })
  }
})

const Rows = () => {
  const { results } = useAtomValue(pokemonListSelector)
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
  const [page, setPage] = useAtom(pokemonListPageNo)
  if (page === 1) {
    return <></>
  }

  return <button onClick={() => setPage((page) => page - 1)}>이전페이지</button>
}

const Next = () => {
  const setPage = useSetAtom(pokemonListPageNo)

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

const JotaiPaging = () => {
  return (
    <Provider>
      <ErrorBoundary fallback={<FailFallBack />}>
        <Suspense fallback={<LoadingFallBack />}>
          <Paginator />
          <Table />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  )
}

export default JotaiPaging

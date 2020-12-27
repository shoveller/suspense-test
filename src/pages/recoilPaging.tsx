import { ErrorBoundary } from 'components/ErrorBoundary'
import { FailFallBack } from 'components/FailFallBack'
import { LoadingFallBack } from 'components/LoadingFallBack'
import PokeAPI, { INamedApiResourceList, IPokemon } from 'pokeapi-typescript'
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

interface IPageParam {
  offset: number
  limit: number
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
  },
})

// /**
//  * 1. 패치에 1초 가량이 걸리는 비동기 호출이 있을때
//  */
// const rand = selector<number>({
//   key: 'rand',
//   get() {
//     return new Promise((resolve) => setTimeout(() => resolve(Math.random()), 1000))
//   },
// })

const pokemonListSelector = selector<INamedApiResourceList<IPokemon>>({
  key: 'pokemonListSelector',
  async get({ get }) {
    const { limit, offset } = get(pokemonListPageSelector(5))
    const pokemonList = await PokeAPI.Pokemon.list(limit, offset)

    // /**
    //  * 2. noWait 이라는 유틸리티 함수를 사용하면 응답속도가 제각각인 ajax호출도 문제없이 관리할 수 있다.
    //  * 이것은 noWait이 값을 loaderble로 만들어주기 때문이다.
    //  * 하지만 잘 동작하지 않는듯하다
    //  */
    // const rndLoaderble = await get(noWait(rand))

    return {
      ...pokemonList,
      results: pokemonList.results.map((item) => {
        return {
          ...item,
          name: `${item.name}`,
        }
      }),
    }
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

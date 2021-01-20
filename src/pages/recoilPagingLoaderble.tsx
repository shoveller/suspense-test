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
  useRecoilValue, useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'

interface IPageParam {
  offset: number
  limit: number
}

// 아톰이나 셀렉터의 이름은 반드시 명사여야 한다
// 동사는 유틸리티 함수가 담당한다.
const pageNo = atom({
  key: 'pageNo',
  default: 1,
})

const pagingInfo = selectorFamily<IPageParam, number>({
  key: 'pagingInfo',
  get: (limit) => ({ get }) => {
    const no = get(pageNo)
    const offset = (no - 1) * limit

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

const pokemonList = selector<INamedApiResourceList<IPokemon>>({
  key: 'pokemonList',
  async get({ get }) {
    const { limit, offset } = get(pagingInfo(5))
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
  const loadable = useRecoilValueLoadable(pokemonList)

  switch (loadable.state) {
    case "loading":
      return <tr><td><LoadingFallBack /></td></tr>
    case "hasError":
      return <tr><td><h6>에러발생</h6></td></tr>
    case "hasValue":
      const rows = loadable.contents.results.map((item, index) => {
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

  return <></>
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
  const [page, setPage] = useRecoilState(pageNo)
  if (page === 1) {
    return <></>
  }

  return <button onClick={() => setPage((page) => page - 1)}>이전페이지</button>
}

const Next = () => {
  const setPage = useSetRecoilState(pageNo)

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
        <Paginator />
        <Table />
      </ErrorBoundary>
    </RecoilRoot>
  )
}

export default RecoilPaging

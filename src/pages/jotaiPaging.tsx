import {ErrorBoundary} from 'components/ErrorBoundary'
import {FailFallBack} from 'components/FailFallBack'
import {LoadingFallBack} from 'components/LoadingFallBack'
import {atom, Provider, useAtom, useAtomValue, useSetAtom} from "jotai"
import {useAtomsDevtools} from "jotai/devtools"
import {atomFamily, atomWithReset, useResetAtom} from "jotai/utils"
import PokeAPI from 'pokeapi-typescript'
import React, {FC, Suspense, useEffect} from 'react'

interface IPageParam {
    offset: number
    limit: number
}

// 리셋을 할 수 있도록 Resettable atom으로 선언
const pokemonListPageNo = atomWithReset(1)

const getPagingInfo = (pageNo: number): IPageParam => {
    const limit = 5
    const offset = (pageNo - 1) * limit

    if (offset < 0) {
        return {
            offset: 0,
            limit: 5,
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
        limit: 5,
    }
}

// atomFamily 내부에 수납되는 key 목록을 담음
const paramSet = new Set<number>()
const pokemonListSelector = atomFamily((pageNo: number) => {
    paramSet.add(pageNo)
    const selector = atom(async (get) => {
        const {limit, offset} = getPagingInfo(pageNo)
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
    selector.debugLabel = 'pokemonListSelector'

    return selector
})

// atom군을 리셋하는 커스텀 훅
const useResetList = () => {
    const resetPager = useResetAtom(pokemonListPageNo)

    return () => {
        resetPager()

        Array.from(paramSet.entries()).forEach(([key]) => {
            pokemonListSelector.remove(key)
        })
    }
}

const Rows = () => {
    const pageNo = useAtomValue(pokemonListPageNo)
    const {results} = useAtomValue(pokemonListSelector(pageNo))
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
            <Rows/>
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
            <Prev/>
            <Next/>
        </p>
    )
}

const DevTools: FC = ({children}) => {
    useAtomsDevtools('JotaiPaging')

    return <>{children}</>
}

const JotaiPaging = () => {
    const resetList = useResetList()
    useEffect(() => {
        return () => {
            resetList()
        }
    },[])

    return (
        <Provider>
            <DevTools>
                <ErrorBoundary fallback={<FailFallBack/>}>
                    <Suspense fallback={<LoadingFallBack/>}>
                        <Paginator/>
                        <Table/>
                    </Suspense>
                </ErrorBoundary>
            </DevTools>
        </Provider>
    )
}

export default JotaiPaging

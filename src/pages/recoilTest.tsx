import React, { PropsWithChildren, useCallback } from 'react'
import { atom, RecoilRoot, selector, useRecoilState } from 'recoil'

export interface IRecoilTestProps {}

interface IUser {
  firstName: string
  lastName: string
  age: number
}

const userState = atom<IUser>({
  key: 'user',
  default: {
    firstName: '홍',
    lastName: '길동',
    age: 30,
  },
})

const userNameSelector = selector<string>({
  key: 'userName',
  get({ get }) {
    const user = get(userState)

    return `${user.firstName} ${user.lastName}`
  },
  set({ set }, name) {
    if (typeof name !== 'string') return
    const [firstName = '', lastName = ''] = name.split(' ')
    set(userState, (prevValue) => {
      return {
        ...prevValue,
        firstName,
        lastName,
      }
    })
  },
})

const DataPane = () => {
  const [userName, setUserName] = useRecoilState(userNameSelector)
  const onInput = useCallback(
    (e) => {
      setUserName(e.target.value)
    },
    [setUserName],
  )

  return (
    <>
      <div>{userName}</div>
      <br />
      <input type="text" onInput={onInput} />
    </>
  )
}

const RecoilTest = (props: PropsWithChildren<IRecoilTestProps>) => {
  return (
    <RecoilRoot>
      <p>recoil의 atom과 selector의 사용법을 배웁니다.</p>
      <DataPane />
    </RecoilRoot>
  )
}

export default RecoilTest

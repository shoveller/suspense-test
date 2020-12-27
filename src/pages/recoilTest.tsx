import produce from 'immer'
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
    set(userState, (user) => {
      /**
       * set 함수는 변경을 반영한 새 객체를 반환해야 합니다.
       * depth가 깊어졌다면 immer를 사용해 절차를 단순하게 만들 수 있습니다.
       */
      // {
      //   ...prevValue,
      //   firstName,
      //   lastName,
      // }
      return produce(user, (draft) => {
        draft.firstName = firstName
        draft.lastName = lastName
      })
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

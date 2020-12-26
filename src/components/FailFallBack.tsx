import React from 'react'

interface IFailFallBackProps {
  errorMessage?: string
}

export const FailFallBack = (props: IFailFallBackProps) => {
  return (
    <>
      <p>통신 실패</p>
      <p>{props?.errorMessage}</p>
    </>
  )
}

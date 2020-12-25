import { Component, ReactNode } from 'react'

interface IProps {
  fallback: ReactNode
  children: ReactNode
}

interface IState {
  hasError: boolean
}

export class ErrorBoundary extends Component<IProps, IState> {
  // 에러 상태를 설정하는 static 메소드를 반드시 구현해야 합니다.
  static getDerivedStateFromError(error) {
    console.error(error)

    return { hasError: true }
  }

  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

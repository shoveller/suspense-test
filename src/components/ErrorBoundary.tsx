import { cloneElement, Component, PropsWithChildren, ReactElement } from 'react'

interface IProps {
  fallback: ReactElement
}

interface IState {
  errorMessage: string
  hasError: boolean
}

export class ErrorBoundary extends Component<PropsWithChildren<IProps>, IState> {
  // 에러 상태를 설정하는 static 메소드를 반드시 구현해야 합니다.
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message }
  }

  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  render() {
    if (this.state.hasError) {
      return cloneElement(this.props.fallback, {
        errorMessage: this.state.errorMessage,
      })
    }

    return this.props.children
  }
}

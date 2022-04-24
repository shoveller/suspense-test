import { DynamicRoutes } from 'components/DynamicRoutes'
import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import './App.css'

const PageLoading = () => <div>페이지 로딩중...</div>

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <ul>
            <li>
              <Link to="/">ErrorBoundary 테스트</Link>
            </li>
            <li>
              <Link to="/suspense">Suspense 테스트</Link>
            </li>
            <li>
              <Link to="/swr">swr을 활용한 ErrorBoundary Suspense 테스트</Link>
            </li>
            <li>
              <Link to="/swrLocal">swr을 활용한 로컬 state 테스트</Link>
            </li>
            <li>
              <Link to="/swrPaging">swr을 활용한 페이징 테스트</Link>
            </li>
            <li>
              <Link to="/recoilTest">recoil의 기본적인 사용법 테스트</Link>
            </li>
            <li>
              <Link to="/recoilPaging">recoil을 활용한 페이징 테스트(suspense)</Link>
            </li>
            <li>
              <Link to="/recoilPagingLoaderble">recoil을 활용한 페이징 테스트(loaderble)</Link>
            </li>
            <li>
              <Link to="/jotaiPaging">jotail를 활용한 페이징 테스트(suspense)</Link>
            </li>
          </ul>
          <DynamicRoutes Loading={<PageLoading />} />
        </BrowserRouter>
      </header>
    </div>
  )
}

export default App

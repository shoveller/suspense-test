import React from 'react'
import { DynamicRoutes } from './DynamicRoutes'
import { BrowserRouter, Link } from 'react-router-dom'
import './App.css'

const Loading = () => <div>Loading...</div>

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
					</ul>
					<DynamicRoutes Loading={<Loading />} />
				</BrowserRouter>
			</header>
		</div>
	)
}

export default App

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
							<Link to="/">To Main Page</Link>
						</li>
						<li>
							<Link to="/sub">To Sub Page</Link>
						</li>
					</ul>
					<DynamicRoutes Loading={<Loading />} />
					<p>
						Add some pages under<code>src/pages</code> and save to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
				</BrowserRouter>
			</header>
		</div>
	)
}

export default App

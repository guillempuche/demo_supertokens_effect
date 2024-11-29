import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'

import './App.css'
import Home from './Home'
import { ComponentWrapper, PreBuiltUIList } from './provider'
import { SuperTokensConfig } from './supertokens'

SuperTokens.init(SuperTokensConfig)

function App() {
	return (
		<SuperTokensWrapper>
			<ComponentWrapper>
				<div className='App app-container'>
					<Router>
						<div className='fill'>
							<Routes>
								{/* This shows the login UI on "/auth" route */}
								{getSuperTokensRoutesForReactRouterDom(
									require('react-router-dom'),
									PreBuiltUIList,
								)}

								<Route
									path='/'
									element={
										/* This protects the "/" route so that it shows
                                    <Home /> only if the user is logged in.
                                    Else it redirects the user to "/auth" */
										<SessionAuth>
											<Home />
										</SessionAuth>
									}
								/>
							</Routes>
						</div>
					</Router>
				</div>
			</ComponentWrapper>
		</SuperTokensWrapper>
	)
}

export default App

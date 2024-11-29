import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'

import { CodeVerification } from './components/auth/code_verification'
import { EmailInput } from './components/auth/email_input'
import { Dashboard } from './components/dashboard'
import { SuperTokensConfig } from './supertokens'

SuperTokens.init(SuperTokensConfig)

export function App() {
	return (
		<SuperTokensWrapper>
			<Router>
				<Routes>
					<Route path='/auth/email' element={<EmailInput />} />
					<Route path='/auth/verify' element={<CodeVerification />} />
					<Route
						path='/dashboard'
						element={
							<SessionAuth>
								<Dashboard />
							</SessionAuth>
						}
					/>
				</Routes>
			</Router>
		</SuperTokensWrapper>
	)
}

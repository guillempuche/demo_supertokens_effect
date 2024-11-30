import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'

import { CodeVerification } from './components/auth/code_verification'
import { EmailInput } from './components/auth/email_input'
import { Dashboard } from './components/dashboard'
import { ThemeProvider } from './contexts/theme'
import { SuperTokensConfig } from './supertokens'
import './i18n'

SuperTokens.init(SuperTokensConfig)

export function App() {
	return (
		<ThemeProvider>
			<SuperTokensWrapper>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Navigate to='/auth/email' replace />} />
						<Route path='auth/email' element={<EmailInput />} />
						<Route path='auth/verify' element={<CodeVerification />} />
						<Route
							path='dashboard'
							element={
								<SessionAuth>
									<Dashboard />
								</SessionAuth>
							}
						/>
					</Routes>
				</BrowserRouter>
			</SuperTokensWrapper>
		</ThemeProvider>
	)
}

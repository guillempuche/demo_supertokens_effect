/**
 * @fileoverview SuperTokens configuration and functions for passwordless and session management.
 *
 * Docs https://supertokens.com/docs/passwordless/quickstart/frontend-setup
 */

import Passwordless, {
	createCode,
	resendCode,
	clearLoginAttemptInfo,
	getLoginAttemptInfo,
	consumeCode,
} from 'supertokens-auth-react/recipe/passwordless'
import Session from 'supertokens-auth-react/recipe/session'

export const SuperTokensConfig = {
	appInfo: {
		appName: 'SuperTokens Demo App',
		apiDomain: import.meta.env.VITE_API_URL,
		websiteDomain: import.meta.env.VITE_WEBSITE_URL,
		apiBasePath: '/auth',
		websiteBasePath: '/auth',
	},
	recipeList: [Passwordless.init({ contactMethod: 'EMAIL' }), Session.init()],
}

export const sendMagicLink = async (email: string, language?: string) => {
	try {
		const response = await createCode({
			email,
			userContext: {
				language,
			},
		})

		if (response.status === 'OK') {
			return { status: 'success' as const }
		}

		return {
			status: 'error' as const,
			error: 'Failed to send magic link',
		}
	} catch (err) {
		return {
			status: 'error' as const,
			error: err instanceof Error ? err.message : 'An error occurred',
		}
	}
}

export async function resendMagicLink(): Promise<{
	status: string
	error?: string
}> {
	try {
		const response = await resendCode()

		if (response.status === 'RESTART_FLOW_ERROR') {
			// User might have logged in on another device
			await clearLoginAttemptInfo()
			return {
				status: 'error',
				error: 'Login failed. Please start the process again.',
			}
		}

		return { status: 'success' }
	} catch (err: any) {
		await clearLoginAttemptInfo()

		if (err.isSuperTokensGeneralError === true) {
			return { status: 'error', error: err.message }
		}
		return { status: 'error', error: 'Something went wrong. Please try again.' }
	}
}

export async function verifyCode(
	userInputCode: string,
): Promise<{ status: string; error?: string }> {
	try {
		// First check if this is the same browser/device that started the flow
		const loginAttemptInfo = await getLoginAttemptInfo()
		if (!loginAttemptInfo) {
			return {
				status: 'error',
				error: 'Please start the login process again from this device.',
			}
		}

		const response = await consumeCode({
			userInputCode,
		})

		if (response.status === 'OK') {
			// Clear login attempt info after successful verification
			await clearLoginAttemptInfo()
			return { status: 'success' }
		}
		return {
			status: 'error',
			error: 'Invalid or expired code. Please try again.',
		}
	} catch (err: any) {
		if (err.isSuperTokensGeneralError === true) {
			return { status: 'error', error: err.message }
		}
		return { status: 'error', error: 'Something went wrong. Please try again.' }
	}
}

// Check if initial magic link has been sent
export async function hasInitialMagicLinkBeenSent(): Promise<boolean> {
	return (await getLoginAttemptInfo()) !== undefined
}

// Check if this is the same browser/device that started the flow
export async function isThisSameBrowserAndDevice(): Promise<boolean> {
	return (await getLoginAttemptInfo()) !== undefined
}

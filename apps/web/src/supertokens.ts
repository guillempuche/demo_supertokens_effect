import Passwordless, {
	createCode,
	resendCode,
	clearLoginAttemptInfo,
} from 'supertokens-auth-react/recipe/passwordless'
import Session from 'supertokens-auth-react/recipe/session'

export const SuperTokensConfig = {
	appInfo: {
		appName: 'SuperTokens Demo App',
		apiDomain: import.meta.env.VITE_API_URL,
		websiteDomain: import.meta.env.VITE_WEBSITE_URL,
	},
	recipeList: [Passwordless.init({ contactMethod: 'EMAIL' }), Session.init()],
}

export async function sendMagicLink(email: string) {
	try {
		const response = await createCode({
			email,
		})

		if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
			// the reason string is a user friendly message
			// about what went wrong. It can also contain a support code which users
			// can tell you so you know why their sign in / up was not allowed.
			window.alert(response.reason)
		} else {
			// Magic link sent successfully.
			window.alert('Please check your email for the magic link')
		}
	} catch (err: any) {
		if (err.isSuperTokensGeneralError === true) {
			// this may be a custom error message sent from the API by you,
			// or if the input email / phone number is not valid.
			window.alert(err.message)
		} else {
			window.alert('Oops! Something went wrong.')
		}
	}
}

export async function resendMagicLink() {
	try {
		const response = await resendCode()

		if (response.status === 'RESTART_FLOW_ERROR') {
			// this can happen if the user has already successfully logged in into
			// another device whilst also trying to login to this one.

			// we clear the login attempt info that was added when the createCode function
			// was called - so that if the user does a page reload, they will now see the
			// enter email / phone UI again.
			await clearLoginAttemptInfo()
			window.alert('Login failed. Please try again')
			window.location.assign('/auth')
		} else {
			// Magic link resent successfully.
			window.alert('Please check your email for the magic link')
		}
	} catch (err: any) {
		if (err.isSuperTokensGeneralError === true) {
			// this may be a custom error message sent from the API by you.
			window.alert(err.message)
		} else {
			window.alert('Oops! Something went wrong.')
		}
	}
}

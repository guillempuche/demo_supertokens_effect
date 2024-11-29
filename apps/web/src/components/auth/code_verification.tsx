import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
	hasInitialMagicLinkBeenSent,
	isThisSameBrowserAndDevice,
	resendMagicLink,
	verifyCode,
} from '../../supertokens'

export const CodeVerification = () => {
	const [code, setCode] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isResending, setIsResending] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		// Check if user should be on this page
		const checkDeviceAndAttempt = async () => {
			const hasInitialLink = await hasInitialMagicLinkBeenSent()
			const isSameDevice = await isThisSameBrowserAndDevice()

			if (!hasInitialLink || !isSameDevice) {
				navigate('/auth/email')
			}
		}
		checkDeviceAndAttempt()
	}, [navigate])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		const result = await verifyCode(code)

		if (result.status === 'success') {
			navigate('/dashboard')
		} else {
			setError(result.error ?? 'Could not verify code')
		}

		setIsLoading(false)
	}

	const handleResend = async () => {
		setIsResending(true)
		setError(null)

		const result = await resendMagicLink()

		if (result.status === 'error') {
			setError(result.error ?? 'Could not resend code')
			// If we need to restart the flow, redirect to email input
			if (result.error?.includes('Please start')) {
				navigate('/auth/email')
				return
			}
		}

		setIsResending(false)
	}

	return (
		<div className='max-w-md mx-auto p-6'>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='code' className='block text-sm font-medium'>
						Verification Code
					</label>
					<input
						id='code'
						type='text'
						value={code}
						onChange={e => setCode(e.target.value)}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
						required
					/>
				</div>

				{error && <div className='text-red-600 text-sm'>{error}</div>}

				<button
					type='submit'
					disabled={isLoading}
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
				>
					{isLoading ? 'Verifying...' : 'Verify Code'}
				</button>

				<button
					type='button'
					onClick={handleResend}
					disabled={isResending}
					className='w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
				>
					{isResending ? 'Resending...' : 'Resend Code'}
				</button>
			</form>
		</div>
	)
}

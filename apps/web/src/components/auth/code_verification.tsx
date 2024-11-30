import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
	hasInitialMagicLinkBeenSent,
	isThisSameBrowserAndDevice,
	resendMagicLink,
	verifyCode,
} from '../../supertokens'
import { Button } from '../ui/button'

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
					<label
						htmlFor='code'
						className='block text-sm font-medium text-on-surface'
					>
						Verification Code
					</label>
					<input
						id='code'
						type='text'
						value={code}
						onChange={e => setCode(e.target.value)}
						className='mt-1 block w-full rounded-medium border-surface-variant bg-surface text-on-surface shadow-sm'
						required
					/>
				</div>

				{error && <div className='text-error text-sm'>{error}</div>}

				<Button type='submit' fullWidth isLoading={isLoading}>
					Verify Code
				</Button>

				<Button
					type='button'
					variant='secondary'
					fullWidth
					isLoading={isResending}
					onClick={handleResend}
				>
					Resend Code
				</Button>
			</form>
		</div>
	)
}

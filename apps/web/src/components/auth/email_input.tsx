import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { hasInitialMagicLinkBeenSent, sendMagicLink } from '../../supertokens'

export const EmailInput = () => {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		// Check if user already started the flow
		const checkExistingAttempt = async () => {
			if (await hasInitialMagicLinkBeenSent()) {
				navigate('/auth/verify')
			}
		}
		checkExistingAttempt()
	}, [navigate])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		const result = await sendMagicLink(email)

		if (result.status === 'success') {
			navigate('/auth/verify')
		} else {
			setError(result.error || 'An error occurred')
		}

		setIsLoading(false)
	}

	return (
		<div className='max-w-md mx-auto p-6'>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='email' className='block text-sm font-medium'>
						Email Address
					</label>
					<input
						id='email'
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
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
					{isLoading ? 'Sending...' : 'Send Code'}
				</button>
			</form>
		</div>
	)
}

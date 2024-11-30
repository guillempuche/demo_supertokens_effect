import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { hasInitialMagicLinkBeenSent, sendMagicLink } from '../../supertokens'
import {
	BodyLarge,
	Button,
	LabelLarge,
	LanguageSelector,
	ThemeToggle,
	TitleLarge,
} from '../ui'

export const EmailInput = () => {
	const { t, i18n } = useTranslation()
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

		const result = await sendMagicLink(email, i18n.language)

		if (result.status === 'success') {
			navigate('/auth/verify')
		} else {
			setError(result.error || 'An error occurred')
		}

		setIsLoading(false)
	}

	return (
		<div className='min-h-screen bg-surface flex flex-col'>
			<div className='flex-1'>
				<div className='max-w-md mx-auto p-8'>
					<div className='mb-8 p-4 bg-blue-600 text-white rounded-medium'>
						<TitleLarge className='mb-2'>
							{t('auth.testInstructions.title')}
						</TitleLarge>
						<BodyLarge>{t('auth.testInstructions.description')} </BodyLarge>
						<BodyLarge>
							<a
								href='http://localhost:9000'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary underline'
							>
								localhost:9000
							</a>
							.
						</BodyLarge>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<LabelLarge htmlFor='email' className='block text-on-surface'>
								{t('auth.emailLabel')}
							</LabelLarge>
							<input
								id='email'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								className='mt-1 block w-full 
									rounded-medium 
									border border-surface-variant
									bg-surface 
									text-on-surface
									px-2 py-1
									placeholder:text-on-surface-variant/70
									shadow-sm
									focus:outline-none
									focus:ring-2
									focus:ring-primary
									focus:border-primary
									hover:border-primary/50
									transition-colors'
								required
							/>
						</div>

						{error && (
							<div
								className='flex items-center gap-2 text-error text-sm'
								role='alert'
							>
								<svg
									className='w-4 h-4'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<title>Error</title>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								</svg>
								{error}
							</div>
						)}

						<Button
							type='submit'
							disabled={!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
							fullWidth
							isLoading={isLoading}
						>
							{t('auth.sendCode')}
						</Button>
					</form>
				</div>
			</div>
			<div className='p-4 flex justify-center items-center gap-4'>
				<ThemeToggle />
				<LanguageSelector />
			</div>
		</div>
	)
}

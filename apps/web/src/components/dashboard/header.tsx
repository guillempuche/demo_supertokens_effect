import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'supertokens-auth-react/recipe/session'
import { LanguageSelector } from '../ui/language_selector'
import { ThemeToggle } from '../ui/theme_toggle'

interface DashboardHeaderProps {
	userId: string
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const handleSignOut = async () => {
		await signOut()
		navigate('/auth/email')
	}

	return (
		<header className='bg-surface-variant shadow'>
			<div className='max-w-7xl mx-auto px-8 py-6 flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-display text-on-surface-variant'>
						{t('dashboard.title')}
					</h1>
					<p className='text-sm text-on-surface-variant/70'>
						{t('dashboard.userId')}: {userId}
					</p>
				</div>
				<div className='flex items-center gap-4'>
					<LanguageSelector />
					<ThemeToggle />
					<button
						type='button'
						onClick={handleSignOut}
						className='px-6 py-2.5 bg-error text-on-error rounded-large hover:bg-error/90 transition-colors'
					>
						{t('dashboard.signOut')}
					</button>
				</div>
			</div>
		</header>
	)
}

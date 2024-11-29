import { useNavigate } from 'react-router-dom'
import { signOut } from 'supertokens-auth-react/recipe/session'

interface DashboardHeaderProps {
	userId: string
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
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
						Dashboard
					</h1>
					<p className='text-sm text-on-surface-variant/70'>
						User ID: {userId}
					</p>
				</div>
				<button
					type='button'
					onClick={handleSignOut}
					className='px-6 py-2.5 bg-error text-on-error rounded-large hover:bg-error/90 transition-colors'
				>
					Sign Out
				</button>
			</div>
		</header>
	)
}

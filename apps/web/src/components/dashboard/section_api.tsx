import { RefreshIcon } from './section_user_metadata'

interface ApiSectionProps<T> {
	title: string
	loading: boolean
	onRefresh: () => void
	data: T | undefined
	renderContent: (data: T) => React.ReactNode
}

export function ApiSection<T>({
	title,
	loading,
	onRefresh,
	data,
	renderContent,
}: ApiSectionProps<T>) {
	return (
		<div className='bg-surface shadow rounded-large border border-surface-variant'>
			<div className='px-6 py-5'>
				<div className='flex justify-between items-start mb-4'>
					<h3 className='text-lg font-display text-on-surface'>{title}</h3>
					<button
						type='button'
						onClick={onRefresh}
						disabled={loading}
						className='p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-medium'
						aria-label='Refresh data'
					>
						<RefreshIcon
							className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
						/>
					</button>
				</div>

				<div className='mt-4'>
					{loading ? (
						<p className='text-on-surface-variant'>Loading...</p>
					) : data ? (
						renderContent(data)
					) : (
						<p className='text-on-surface-variant'>No data available</p>
					)}
				</div>
			</div>
		</div>
	)
}

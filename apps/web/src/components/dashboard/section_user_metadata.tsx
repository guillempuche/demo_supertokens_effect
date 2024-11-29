interface UserMetadata {
	userId: string
	metadata: Record<string, any>
}

interface UserMetadataSectionProps {
	loading: boolean
	onRefresh: () => void
	data: UserMetadata | undefined
}

export function UserMetadataSection({
	loading,
	onRefresh,
	data,
}: UserMetadataSectionProps) {
	return (
		<div className='bg-surface shadow rounded-large border border-surface-variant'>
			<div className='px-6 py-5'>
				<div className='flex justify-between items-start mb-4'>
					<h3 className='text-lg font-display text-on-surface'>
						User Metadata
					</h3>
					<button
						type='button'
						onClick={onRefresh}
						disabled={loading}
						className='p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-medium'
						aria-label='Refresh metadata'
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
						<div>
							<p className='text-on-surface mb-2'>User ID: {data.userId}</p>
							<div className='bg-surface-variant/50 p-4 rounded-medium'>
								<pre className='text-sm text-on-surface-variant whitespace-pre-wrap'>
									{JSON.stringify(data.metadata, null, 2)}
								</pre>
							</div>
						</div>
					) : (
						<p className='text-on-surface-variant'>No metadata available</p>
					)}
				</div>
			</div>
		</div>
	)
}

export const RefreshIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
		aria-label='Refresh'
		role='img'
	>
		<title>Refresh</title>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
		/>
	</svg>
)

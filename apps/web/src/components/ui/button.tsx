import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	fullWidth?: boolean
	isLoading?: boolean
}

export function Button({
	children,
	variant = 'primary',
	fullWidth = false,
	isLoading = false,
	disabled,
	className = '',
	...props
}: ButtonProps) {
	const baseStyles =
		'flex justify-center items-center py-2 px-4 rounded-medium text-sm font-medium transition-all duration-200 cursor-pointer'
	const widthStyles = fullWidth ? 'w-full' : ''

	const variants = {
		primary: `
			bg-primary text-on-primary border-2 border-primary/20
			shadow-sm
			enabled:hover:bg-primary/90 
			enabled:hover:translate-y-[-1px]
			enabled:hover:shadow-md
			enabled:active:bg-primary/80 
			enabled:active:translate-y-[1px]
			enabled:active:shadow-sm
			enabled:focus-visible:outline-none
			enabled:focus-visible:ring-2
			enabled:focus-visible:ring-primary/50
			enabled:focus-visible:ring-offset-2
			enabled:focus-visible:ring-offset-surface
			disabled:bg-surface-variant
			disabled:text-on-surface-variant/50
			disabled:border-dashed
			disabled:border-surface-variant
			disabled:shadow-none
		`,
		secondary: `
			bg-surface text-on-surface border-2 border-surface-variant
			shadow-sm
			enabled:hover:bg-surface-variant 
			enabled:hover:translate-y-[-1px]
			enabled:hover:shadow-md
			enabled:active:bg-surface-variant/90 
			enabled:active:translate-y-[1px]
			enabled:active:shadow-sm
			enabled:focus-visible:outline-none
			enabled:focus-visible:ring-2
			enabled:focus-visible:ring-primary/50
			enabled:focus-visible:ring-offset-2
			enabled:focus-visible:ring-offset-surface
			disabled:bg-surface
			disabled:text-on-surface-variant/50
			disabled:border-dashed
			disabled:border-surface-variant
			disabled:shadow-none
		`,
	}

	return (
		<button
			disabled={disabled || isLoading}
			className={`
				${baseStyles}
				${widthStyles}
				${variants[variant]}
				disabled:cursor-not-allowed
				${className}
			`.trim()}
			{...props}
		>
			{isLoading ? (
				<>
					<svg
						className='animate-spin -ml-1 mr-2 h-4 w-4'
						fill='none'
						viewBox='0 0 24 24'
						aria-hidden='true'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						/>
					</svg>
					Loading...
				</>
			) : (
				children
			)}
		</button>
	)
}

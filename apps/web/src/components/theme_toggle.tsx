import { useTheme } from '../contexts/theme'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<div className='relative inline-flex'>
			<select
				value={theme}
				onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'system')}
				className='appearance-none bg-surface-variant text-on-surface-variant px-3 py-1.5 pr-8 rounded-medium border border-surface-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50'
			>
				<option value='light'>Light</option>
				<option value='dark'>Dark</option>
				<option value='system'>System</option>
			</select>
			<span className='absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none'>
				{theme === 'light' && <SunIcon />}
				{theme === 'dark' && <MoonIcon />}
				{theme === 'system' && <ComputerIcon />}
			</span>
		</div>
	)
}

function SunIcon() {
	return (
		<svg
			className='w-4 h-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			aria-hidden='true'
			role='img'
		>
			<title>Light mode</title>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
			/>
		</svg>
	)
}

function MoonIcon() {
	return (
		<svg
			className='w-4 h-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			aria-hidden='true'
			role='img'
		>
			<title>Dark mode</title>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
			/>
		</svg>
	)
}

function ComputerIcon() {
	return (
		<svg
			className='w-4 h-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			aria-hidden='true'
			role='img'
		>
			<title>System preference</title>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
			/>
		</svg>
	)
}

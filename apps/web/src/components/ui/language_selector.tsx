import { useTranslation } from 'react-i18next'

export function LanguageSelector() {
	const { i18n } = useTranslation()

	const handleLanguageChange = (language: string) => {
		i18n.changeLanguage(language)
		localStorage.setItem('language', language)
	}

	return (
		<div className='relative inline-flex'>
			<select
				value={i18n.language}
				onChange={e => handleLanguageChange(e.target.value)}
				className='appearance-none bg-surface-variant text-on-surface-variant px-3 py-1.5 pr-8 rounded-medium border border-surface-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50'
			>
				<option value='en'>English</option>
				<option value='es'>Español</option>
			</select>
			<span className='absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none'>
				<LanguageIcon />
			</span>
		</div>
	)
}

function LanguageIcon() {
	return (
		<svg
			className='w-4 h-4'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<title>Language Icon</title>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
			/>
		</svg>
	)
}

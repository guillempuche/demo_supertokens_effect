import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem('theme')
		return (stored as Theme) || 'system'
	})

	useEffect(() => {
		function updateTheme() {
			const root = window.document.documentElement
			root.classList.remove('light', 'dark')

			if (theme === 'system') {
				const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
					.matches
					? 'dark'
					: 'light'
				root.classList.add(systemTheme)
			} else {
				root.classList.add(theme)
			}

			localStorage.setItem('theme', theme)
		}

		updateTheme()

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = () => {
			if (theme === 'system') {
				updateTheme()
			}
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

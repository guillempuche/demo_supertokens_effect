/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.svg' {
	const content: string
	export default content
}

interface Window {
	open(url?: string, target?: string, features?: string): Window | null
}

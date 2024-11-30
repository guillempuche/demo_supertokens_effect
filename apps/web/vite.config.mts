import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
	return {
		base: '/',
		build: {
			emptyOutDir: true,
			outDir: './dist',
			rollupOptions: {
				input: 'src/index.html',
			},
			sourcemap: mode !== 'production',
		},
		envDir: '../',
		plugins: [
			react(),
			tailwindcss(),
			VitePWA({
				registerType: 'autoUpdate',
				includeAssets: ['favicon.ico', 'logo.svg'],
				manifest: {
					name: 'Xiroi',
					short_name: 'Xiroi',
					icons: [
						{
							src: 'favicon.ico',
							sizes: '64x64 32x32 24x24 16x16',
							type: 'image/x-icon',
						},
						{
							src: 'logo.svg',
							type: 'image/svg+xml',
							sizes: 'any',
							purpose: 'any maskable',
						},
					],
					theme_color: '#c44eff',
					background_color: '#c44eff',
					display: 'standalone',
					scope: '/',
					start_url: '/',
				},
				workbox: {
					maximumFileSizeToCacheInBytes: 5242880, // 5 MiB
				},
			}),
		].filter(Boolean),
		// Preview server config (for production builds)
		preview: {
			port: 4173,
			host: true,
			strictPort: true,
		},
		publicDir: './public',
		root: 'src',
		// Development server config
		server: {
			open: false,
			port: 3000,
			host: true,
			strictPort: true,
		},
		assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
	}
})

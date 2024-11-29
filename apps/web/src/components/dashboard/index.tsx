import { useEffect, useState } from 'react'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'

import { DashboardHeader } from './header'
import { ApiSection } from './section_api'
import { UserMetadataSection } from './section_user_metadata'

interface HelloResponse {
	message: string
}

interface ProtectedResponse {
	userId: string
}

interface UserMetadata {
	userId: string
	metadata: Record<string, any>
}

export function Dashboard() {
	const session = useSessionContext()
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState({
		hello: false,
		protected: false,
		metadata: false,
	})
	const [data, setData] = useState<{
		hello?: HelloResponse
		protected?: ProtectedResponse
		metadata?: UserMetadata
	}>({})

	const fetchHelloEndpoint = async () => {
		setLoading(prev => ({ ...prev, hello: true }))
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/demo/hello`)
			if (!response.ok) throw new Error('Failed to fetch hello endpoint')
			const data = await response.json()
			setData(prev => ({ ...prev, hello: data }))
		} catch (err) {
			setError('Failed to fetch hello message')
			console.error(err)
		} finally {
			setLoading(prev => ({ ...prev, hello: false }))
		}
	}

	const fetchProtectedEndpoint = async () => {
		setLoading(prev => ({ ...prev, protected: true }))
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/demo/protected`,
			)
			if (!response.ok) throw new Error('Failed to fetch protected endpoint')
			const data = await response.json()
			setData(prev => ({ ...prev, protected: data }))
		} catch (err) {
			setError('Failed to fetch protected data')
			console.error(err)
		} finally {
			setLoading(prev => ({ ...prev, protected: false }))
		}
	}

	const fetchUserMetadata = async () => {
		setLoading(prev => ({ ...prev, metadata: true }))
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/users/metadata`,
			)
			if (!response.ok) throw new Error('Failed to fetch user metadata')
			const data = await response.json()
			setData(prev => ({ ...prev, metadata: data }))
		} catch (err) {
			setError('Failed to fetch user metadata')
			console.error(err)
		} finally {
			setLoading(prev => ({ ...prev, metadata: false }))
		}
	}

	useEffect(() => {
		fetchHelloEndpoint()
		fetchProtectedEndpoint()
		fetchUserMetadata()
	}, [])

	if (session.loading) {
		return (
			<div className='flex justify-center items-center h-screen bg-surface text-on-surface'>
				Loading...
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-surface'>
			<DashboardHeader userId={session.userId || ''} />

			<main className='max-w-7xl mx-auto py-8 px-6'>
				{error && (
					<div className='mb-6 bg-error/10 border border-error text-error px-6 py-4 rounded-large'>
						{error}
					</div>
				)}

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					<ApiSection
						title='Hello Endpoint'
						loading={loading.hello}
						onRefresh={fetchHelloEndpoint}
						data={data.hello}
						renderContent={data => (
							<p className='text-on-surface'>{data?.message}</p>
						)}
					/>

					<ApiSection
						title='Protected Endpoint'
						loading={loading.protected}
						onRefresh={fetchProtectedEndpoint}
						data={data.protected}
						renderContent={data => (
							<p className='text-on-surface'>User ID: {data?.userId}</p>
						)}
					/>

					<UserMetadataSection
						loading={loading.metadata}
						onRefresh={fetchUserMetadata}
						data={data.metadata}
					/>
				</div>
			</main>
		</div>
	)
}

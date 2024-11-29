export default function CallAPIView() {
	async function handleAPICall() {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/sessioninfo`)
		const data = await response.json()
		window.alert(`Session Information:\n${JSON.stringify(data, null, 2)}`)
	}

	function handleKeyPress(event: React.KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleAPICall()
		}
	}

	return (
		<button
			type='button'
			onClick={handleAPICall}
			onKeyDown={handleKeyPress}
			className='sessionButton'
		>
			Call API
		</button>
	)
}

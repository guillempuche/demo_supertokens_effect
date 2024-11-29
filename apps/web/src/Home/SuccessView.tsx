import type * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'supertokens-auth-react/recipe/session'

import {
	BlogsIcon,
	CelebrateIcon,
	GuideIcon,
	SeparatorLine,
	SignOutIcon,
} from '../images'
import CallAPIView from './CallAPIView'

interface ILink {
	name: string
	onClick: () => void
	icon: string
}

export default function SuccessView(props: { userId: string }): JSX.Element {
	const userId = props.userId
	const navigate = useNavigate()

	async function logoutClicked(): Promise<void> {
		await signOut()
		navigate('/auth')
	}

	function openLink(url: string): void {
		window?.open(url, '_blank')
	}

	const links: ILink[] = [
		{
			name: 'Blogs',
			onClick: () => openLink('https://supertokens.com/blog'),
			icon: BlogsIcon,
		},
		{
			name: 'Documentation',
			onClick: () =>
				openLink('https://supertokens.com/docs/passwordless/introduction'),
			icon: GuideIcon,
		},
		{
			name: 'Sign Out',
			onClick: logoutClicked,
			icon: SignOutIcon,
		},
	]

	return (
		<>
			<div className='main-container'>
				<div className='top-band success-title bold-500'>
					<img src={CelebrateIcon} alt='Celebrate' className='success-icon' />{' '}
					Login successful
				</div>
				<div className='inner-content'>
					<div>Your userID is:</div>
					<div className='truncate' id='user-id'>
						{userId}
					</div>
					<CallAPIView />
				</div>
			</div>
			<div className='bottom-links-container'>
				{links.map((link: ILink) => (
					<div className='link' key={link.name}>
						<img src={link.icon} alt={link.name} className='link-icon' />
						<button
							type='button'
							onClick={link.onClick}
							onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
								if (e.key === 'Enter') link.onClick()
							}}
							className='link-button'
						>
							{link.name}
						</button>
					</div>
				))}
			</div>
			<img src={SeparatorLine} alt='Separator' className='separator-line' />
		</>
	)
}

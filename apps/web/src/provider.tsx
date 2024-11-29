import { PasswordlessComponentsOverrideProvider } from 'supertokens-auth-react/recipe/passwordless'
import { PasswordlessPreBuiltUI } from 'supertokens-auth-react/recipe/passwordless/prebuiltui'

export const PreBuiltUIList = [PasswordlessPreBuiltUI]

export const ComponentWrapper = ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<PasswordlessComponentsOverrideProvider
			components={{
				PasswordlessUserInputCodeFormFooter_Override: ({
					DefaultComponent,
					...props
				}) => {
					const loginAttemptInfo = props.loginAttemptInfo
					let showQuotaMessage = false

					if (loginAttemptInfo.contactMethod === 'PHONE') {
						showQuotaMessage = true
					}

					return (
						<div
							style={{
								width: '100%',
							}}
						>
							<DefaultComponent {...props} />
							{showQuotaMessage && (
								<div
									style={{
										width: '100%',
										paddingLeft: 12,
										paddingRight: 12,
										paddingTop: 6,
										paddingBottom: 6,
										borderRadius: 4,
										backgroundColor: '#EF9A9A',
										margin: 0,
										boxSizing: 'border-box',
										MozBoxSizing: 'border-box',
										WebkitBoxSizing: 'border-box',
										fontSize: 12,
										textAlign: 'start',
										fontWeight: 'bold',
										lineHeight: '18px',
									}}
								>
									There is a daily quota for the free SMS service, if you do not
									receive the SMS please try again tomorrow.
								</div>
							)}
						</div>
					)
				},
			}}
		>
			{children}
		</PasswordlessComponentsOverrideProvider>
	)
}

import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
	className?: string
}

interface BodyProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode
	className?: string
}

interface LabelProps extends LabelHTMLAttributes<HTMLSpanElement> {
	children: ReactNode
	className?: string
}

export function DisplaySmall({ children, className, ...props }: HeadingProps) {
	return (
		<h1
			className={twMerge(
				'text-[36px] leading-[44px] font-display tracking-[0px]',
				className,
			)}
			{...props}
		>
			{children}
		</h1>
	)
}

export function TitleLarge({ children, className, ...props }: HeadingProps) {
	return (
		<h2
			className={twMerge('text-[28px] leading-[36px] font-display', className)}
			{...props}
		>
			{children}
		</h2>
	)
}

export function BodyLarge({ children, className, ...props }: BodyProps) {
	return (
		<span
			className={twMerge(
				'text-[16px] leading-[24px] font-body tracking-[0.5px]',
				className,
			)}
			{...props}
		>
			{children}
		</span>
	)
}

export function LabelLarge({ children, className, ...props }: LabelProps) {
	return (
		<span
			className={twMerge(
				'text-[16px] leading-[24px] font-body tracking-[0.5px]',
				className,
			)}
			{...props}
		>
			{children}
		</span>
	)
}

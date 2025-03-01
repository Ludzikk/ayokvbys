import { ReactNode, ButtonHTMLAttributes } from "react";

type MyProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	className?: string;
	isLink?: boolean;
};

export default function Button({ children, className, ...rest }: MyProps) {
	return (
		<button
			className={`py-3 px-8 rounded-3xl border border-purple-600 bg-purple-600/20 hover:bg-purple-600/40 duration-300 lg:text-lg ${className}`}
			{...rest}>
			{children}
		</button>
	);
}

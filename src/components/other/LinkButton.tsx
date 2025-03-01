import { ReactNode } from "react";
import { Link } from "react-router-dom";

type MyProps = {
	children: ReactNode;
	to: string;
	className?: string;
};

export default function LinkButton({ children, to, className }: MyProps) {
	return (
		<Link
			to={to}
			className={`py-3 px-8 rounded-4xl border border-purple-600 bg-purple-600/20 hover:bg-purple-600/40 duration-300 lg:text-lg ${className}`}>
			{children}
		</Link>
	);
}

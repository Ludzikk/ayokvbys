import { ReactNode } from "react";

type BeatButtonProps = {
	children: ReactNode;
	className?: string;
};

export default function BeatButton({ children, className }: BeatButtonProps) {
	return (
		<button
			className={`flex font-bold gap-1 py-2 px-6 rounded-md text-white/80 border bg-purple-600/20 border-purple-600 hover:bg-purple-600/40 duration-300 ${className}`}>
			{children}
		</button>
	);
}

import { FaDiscord, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Icons() {
	return (
		<nav className="flex gap-8 text-2xl lg:text-3xl xl:text-4xl">
			<div className="relative group flex items-center">
				<FaDiscord className="group-hover:translate-x-[-400%] duration-300" />
				<span className="absolute right-0  opacity-0  group-hover:opacity-100 duration-300">
					stroj100
				</span>
			</div>
			<a
				href="https://www.youtube.com/@AyoKvbys"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-purple-600 duration-300">
				<FaYoutube />
			</a>
			<a
				href="https://www.instagram.com/masa.spzoo/"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-purple-600 duration-300">
				<FaInstagram />
			</a>
		</nav>
	);
}

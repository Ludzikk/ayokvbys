import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Nav() {
	const [lettersAmount, setLetterAmount] = useState(0);
	const [firstRender, setFirstRender] = useState(true);
	const logoText = "ayokvbys";
	const animSpeed = 100;

	const linksData = [
		{
			to: ".",
			name: "Home",
		},
		{
			to: "beats",
			name: "Beats",
		},
		{
			to: "free",
			name: "Free",
		},
	];

	useEffect(() => {
		if (!firstRender) {
			let currentLetters = 0;

			const addLetter = () => {
				setLetterAmount((prevVal) => prevVal + 1);
				currentLetters++;

				if (currentLetters < logoText.length) {
					setTimeout(addLetter, animSpeed);
				}
			};

			addLetter();
		}

		setFirstRender(false);
	}, [firstRender]);

	const linksEl = linksData.map((link, index) => {
		return (
			<NavLink
				key={index}
				to={link.to}
				end
				className={({ isActive }) =>
					isActive
						? "text-purple-600 hover:text-purple-800 duration-300"
						: "hover:text-white/70 duration-300"
				}>
				{link.name}
			</NavLink>
		);
	});

	return (
		<nav className="py-8 absolute w-screen z-50">
			<div className="max-w-[1200px] w-full mx-auto px-2 flex justify-between md:justify-center text-center items-center lg:text-lg xl:text-xl gap-20 relative">
				<Link
					to="."
					className="hover:text-white/70 duration-300 text-4xl md:text-6xl text-left  font-logo md:w-[33%]">
					{logoText.slice(0, lettersAmount)}
				</Link>
				<div className="flex gap-8">{linksEl}</div>
				<div className="hidden w-[33%] md:block"></div>
			</div>
		</nav>
	);
}

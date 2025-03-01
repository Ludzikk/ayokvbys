import Icons from "../header/Icons";
import Title from "../header/Title";
import LinkButton from "../other/LinkButton";
import BackgroundHero from "../other/BackgroundHero";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export default function Header() {
	const globalContext = useContext(GlobalContext)
	const authorized = globalContext?.authorized

	return (
		<header className="h-screen">
			<div className="max-w-[1200px] w-full mx-auto h-full flex flex-col justify-center items-center relative z-[1] gap-16">
				<Title />
				<Icons />
				<LinkButton to="beats">Listen to beats</LinkButton>
			</div>
			<BackgroundHero />
			{authorized ? <Link to="add" className="absolute bottom-[20px] left-[20px] z-[50]">add</Link> : null}
		</header>
	);
}

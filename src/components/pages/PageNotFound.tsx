import LinkButton from "../other/LinkButton";
import BackgroundHero from "../other/BackgroundHero";

export default function PageNotFound() {
	return (
		<>
			<BackgroundHero />
			<main className="h-screen flex flex-col justify-center items-center gap-6 relative z-[1]">
				<h1 className="text-2xl lg:text-3xl">Page not found</h1>
				<LinkButton to={".."}>Go back to home</LinkButton>
			</main>
		</>
	);
}

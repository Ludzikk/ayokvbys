import BackgroundHero from "../other/BackgroundHero";
import BeatsSection from "../beats/BeatsSection";

export default function BeatsPage() {
	return (
		<>
			<BackgroundHero />
			<main className="pt-40 relative z-[1] flex flex-1">
				<div className="max-w-[1200px] w-full mx-auto px-2 flex flex-1">
					<BeatsSection />
				</div>
			</main>
		</>
	);
}

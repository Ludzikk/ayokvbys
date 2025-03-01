import BackgroundHero from "../other/BackgroundHero";
import BeatsSection from "../beats/BeatsSection";
import { useEffect } from "react";

type BeatsPageProps = {
	title: string;
	isFree?: boolean
};

export default function BeatsPage({ title, isFree }: BeatsPageProps) {

	useEffect(() => {
		document.title = `ayokvbys - ${title}`
	}, [title])

	return (
		<>
			<BackgroundHero />
			<main className="pt-30 md:pt-40 relative z-[1] flex flex-1">
				<div className="max-w-[1200px] w-full mx-auto px-2 flex flex-1">
					<BeatsSection isFree={isFree} />
				</div>
			</main>
		</>
	);
}

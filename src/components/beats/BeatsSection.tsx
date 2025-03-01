import BeatsItem from "../beats/BeatsItem";
import { useContext, useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { GlobalContext } from "../../App";

type BeatsSectionProps = {
	isFree?: boolean;
};

type Beat = {
	audio: string;
	img: string;
	title: string;
	isFree: boolean;
	bpm: number;
	key: string;
	playing: boolean;
	id: number;
	showPlayer: boolean;
};

export default function BeatsSection({ isFree = false }: BeatsSectionProps) {
	const [beatsData, setBeatsData] = useState<Beat[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const context = useContext(GlobalContext);

	if (!context) throw new Error("FirebaseContext is not provided!");

	const { db } = context;

	const beatsEl = beatsData.map((beat, index) => {
		return (
			<BeatsItem
				key={`${index}-${beat.title}`}
				title={beat.title}
				img={beat.img}
				audio={beat.audio}
				isFree={beat.isFree}
				bpm={beat.bpm}
				beatKey={beat.key}
				index={index}
				playing={beat.playing}
				changePlaying={changePlaying}
				showPlayer={beat.showPlayer}
			/>
		);
	});

	function changePlaying(id: number) {
		const beatsDataAfterUpdate = beatsData.map((beat) => {
			if (beat.id === id) {
				return { ...beat, playing: !beat.playing, showPlayer: true };
			}

			return { ...beat, playing: false, showPlayer: false };
		});

		setBeatsData(beatsDataAfterUpdate);
	}

	useEffect(() => {
		const beatsRef = collection(db, "beats");

		async function fetchData() {
			try {
				const querySnapshot = await getDocs(beatsRef);

				if (querySnapshot.empty) return;

				const data = querySnapshot.docs.map((doc) => doc.data());
				const dataUpdated: Beat[] = data
					.filter((beat): beat is Beat => beat.isFree === isFree) // Upewnia się, że to Beat[]
					.map((beat, index) => ({
						...beat,
						id: index,
						playing: false,
						showPlayer: false,
					}));

				setBeatsData(dataUpdated);
			} catch (error) {
				console.error("Błąd podczas pobierania danych:", error);
				throw error;
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [isFree, db]);

	return (
		<section className="bg-black/80 p-4 rounded-lg w-full h-[70vh]">
			<h2 className="font-bold text-2xl pb-6">
				<span>{beatsEl.length}</span> Tracks
			</h2>
			<div className="h-[calc(100%-56px)] overflow-hidden">
				{loading ? (
					<div className="h-[calc(100%-56px)] flex justify-center items-center">
						<div className="loader w-[80px] bg-purple-600"></div>
					</div>
				) : beatsData.length > 0 ? (
					<ul className="flex flex-col gap-6 h-full overflow-auto overflow-x-hidden scrollbar pr-4">
						{beatsEl}
					</ul>
				) : (
					<div className="h-[calc(100%-56px)] flex justify-center items-center">
						<p className=" text-xl text-center">No tracks available</p>
					</div>
				)}
			</div>
		</section>
	);
}

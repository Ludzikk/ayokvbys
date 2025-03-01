import { GlobalContext } from "../../App";
import BackgroundHero from "../other/BackgroundHero";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "../other/Button";
import Popup from "../other/Popup";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function AddPage() {
	const [showPopup, setShopPopup] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const [uploading, setUploading] = useState(false);

	const globalContext = useContext(GlobalContext);
	const authorized = globalContext?.authorized;
	const storage = globalContext?.storage;
	const db = globalContext?.db;

	const inputClassNames =
		"bg-purple-600/20 border border-purple-600 rounded-md p-2 mb-4";

	async function uploadTrack(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);

		const { title, key, bpm, buyLink, cover, audio, isFree } =
			Object.fromEntries(formData);

		if (cover instanceof File && audio instanceof File)
			if (title && key && bpm && cover.size > 0 && audio.size > 0) {
				if (!storage) return;

				setUploading(true);

				const coverFileName = cover.name;
				const audioFileName = audio.name;

				if (coverFileName !== null && audioFileName !== null) {
					const coverRef = ref(storage, `img/${coverFileName}`);
					const audioRef = ref(storage, `beats/${audioFileName}`);

					if (cover instanceof File) {
						await Promise.all([
							uploadBytes(coverRef, cover),
							uploadBytes(audioRef, audio),
						]);
					}

					const coverUrl = await getDownloadURL(coverRef).then((url) => {
						return url;
					});

					const audioUrl = await getDownloadURL(audioRef).then((url) => {
						return url;
					});

					if (!db) return;

					const docRef = doc(db, "beats", `${title}`);

					await setDoc(docRef, {
						img: coverUrl,
						audio: audioUrl,
						bpm: bpm,
						title: title,
						key: key,
						isFree: isFree ? true : false,
						playing: false,
						showPlayer: false,
						buyLink: buyLink === "" ? "none" : buyLink,
					}).then(() => {
						setShopPopup(true);
						setPopupMessage("Successfully added new track");
					});
				}
			} else {
				setShopPopup(true);
				setPopupMessage("Invalid or missing data");
			}

		setUploading(false);

		setTimeout(() => {
			setShopPopup(false);
			setPopupMessage("");
		}, 5000);
	}

	useEffect(() => {
		document.title = `ayokvbys - add`;
	}, []);

	if (!authorized) {
		return <Navigate to="../login" replace={true} />;
	}

	return (
		<>
			<BackgroundHero />
			<main className="pt-30 md:pt-40 relative z-[1]">
				<div className="max-w-[1200px] w-full mx-auto px-2 flex flex-col justify-center">
					<form
						onSubmit={uploadTrack}
						action=""
						className="bg-black/80 p-8 rounded-lg flex flex-col gap-2 mx-auto">
						<div className="flex gap-2">
							<div className="flex flex-col">
								<label htmlFor="title">Title</label>
								<input
									type="text"
									id="title"
									name="title"
									className={inputClassNames}
								/>
								<label htmlFor="key">Key</label>
								<input
									type="text"
									id="key"
									name="key"
									className={inputClassNames}
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="bpm">bpm</label>
								<input
									type="number"
									id="bpm"
									name="bpm"
									className={inputClassNames}
								/>
								<label htmlFor="buyLink">Buy Link (if needed)</label>
								<input
									type="text"
									id="buyLink"
									name="buyLink"
									className={inputClassNames}
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<div className="flex flex-col">
								<label htmlFor="cover">Cover (img)</label>
								<input
									type="file"
									accept="image/*"
									id="cover"
									name="cover"
									className={`${inputClassNames} w-[220px]`}
								/>
								<label htmlFor="isFree">Is free?</label>
								<input
									type="checkbox"
									id="isFree"
									name="isFree"
									className={`${inputClassNames} mr-auto`}
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="audio">Audio</label>
								<input
									type="file"
									accept=".mp3, audio/mp3, audio/mpeg"
									id="audio"
									name="audio"
									className={`${inputClassNames} w-[220px]`}
								/>
								<Button className="flex justify-center" type="submit">
									{uploading ? (
										<div className="loader w-[25px] bg-purple-400"></div>
									) : (
										"Upload"
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</main>
			{showPopup ? <Popup>{popupMessage}</Popup> : null}
		</>
	);
}

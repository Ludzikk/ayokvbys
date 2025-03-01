import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { RefObject, useContext, useRef, useState } from "react";
import BuyButton from "./BuyButton"

type BeatPlayerProps = {
	audioElmRef: RefObject<CustomHTMLAudioElement>;
	toggleAudio: () => void;
	img: string;
	title: string;
	playing: boolean;
};

interface CustomHTMLAudioElement extends HTMLAudioElement {
	_audioCtx?: AudioContext;
	_sourceNode?: MediaElementAudioSourceNode;
}

import { GlobalContext } from "../../App";

export default function BeatPlayer({
	audioElmRef,
	toggleAudio,
	img,
	title,
	playing,
}: BeatPlayerProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setChangedTime] = useState<number>(0);
	const progressContainerRef = useRef<HTMLDivElement>(null);

	const globalContext = useContext(GlobalContext);
	const volume = globalContext?.volume ?? 1;
	const changeVolume = globalContext?.changeVolume;

	function getCorrectTimeFormat(time: number) {
		let correctedTime: string = "";

		if (time < 10) {
			correctedTime = `0:0${Math.floor(time)}`;
		} else if (time < 60) {
			correctedTime = `0:${Math.floor(time)}`;
		} else {
			const minutes = Math.floor(time / 60);
			const seconds = Math.floor(time % 60);
			correctedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
		}

		return correctedTime;
	}

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (audioElmRef.current && progressContainerRef.current) {
			const width = progressContainerRef.current.clientWidth;
			const clickX = e.nativeEvent.offsetX;
			audioElmRef.current.currentTime =
				(clickX / width) * audioElmRef.current.duration;

			setChangedTime((prevVal) => prevVal + 1);
		}
	};

	return (
		<div className="absolute bottom-0 left-0 h-[75px] w-screen bg-black px-4">
			{audioElmRef ? (
				<div className="max-w-[1200px] w-full mx-auto h-full">
					<div className="flex justify-center items-center flex-col md:flex-row gap-4 h-full">
						<div className="flex items-center gap-4 w-full md:w-auto flex-1">
							{playing ? (
								<button onClick={toggleAudio}>
									<FaPause className=" hover:text-purple-600 duration-300" />
								</button>
							) : (
								<button onClick={toggleAudio}>
									<FaPlay className=" hover:text-purple-600 duration-300" />
								</button>
							)}
							<span className="w-[30px] text-right">
								{getCorrectTimeFormat(audioElmRef.current.currentTime)}
							</span>
							<div
								ref={progressContainerRef}
								onClick={handleProgressClick}
								className="w-full cursor-pointer py-4">
								<div className="relative w-full h-[2px] bg-white/50">
									<div
										className="absolute top-0 left-0 h-full w-[0] bg-purple-600"
										style={{
											width: `${
												(audioElmRef.current.currentTime /
													audioElmRef.current.duration) *
												100
											}%`,
										}}></div>
								</div>
							</div>
							<span className="w-[30px]">
								{getCorrectTimeFormat(audioElmRef.current.duration)}
							</span>
							<div className="relative group">
								<div className="absolute bottom-[25px] w-full h-[100px] bg-white/20 overflow-hidden hidden group-hover:block hover:block duration-300">
									<input
										className="absolute bottom-[40px] left-1/2 translate-x-[-50%] w-[100px] rotate-[-90deg] bg-purple-600"
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={volume}
										onChange={(e) => {
											if (changeVolume) {
												changeVolume(parseFloat(e.target.value));
											}
										}}
									/>
								</div>
								<FaVolumeUp className="text-2xl" />
							</div>
						</div>
						<div className="md:flex items-center gap-2 hidden">
							<img
								src={img}
								alt={title}
								className="h-[40px] w-[40px] object-cover rounded"
							/>
							<span className="max-w-[250px] truncate">{title}</span>
						</div>
						<BuyButton>Buy it</BuyButton>
					</div>
				</div>
			) : null}
		</div>
	);
}

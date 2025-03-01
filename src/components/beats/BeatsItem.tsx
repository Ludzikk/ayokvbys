import { useContext, useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";
import DownloadButton from "./DownloadButton";
import BuyButton from "./BuyButton";
import BeatAnalyser from "./BeatAnalyser";
import BeatPlayer from "./BeatPlayer";

type MyProps = {
	audio: string;
	img: string;
	title: string;
	isFree: boolean;
	bpm: number;
	beatKey: string;
	index: number;
	playing: boolean;
	changePlaying: (id: number) => void;
	showPlayer: boolean;
};

interface AnalyzerData {
	analyzer: AnalyserNode;
	bufferLength: number;
	dataArray: Uint8Array;
}

interface CustomHTMLAudioElement extends HTMLAudioElement {
	_audioCtx?: AudioContext; // Opcjonalna właściwość
	_sourceNode?: MediaElementAudioSourceNode; // Opcjonalna właściwość
}

interface ExtendedWindow extends Window {
	AudioContext: typeof AudioContext;
	webkitAudioContext?: typeof AudioContext;
}

import { GlobalContext } from "../../App";

export default function BeatsItem({
	audio,
	img,
	title,
	isFree,
	bpm,
	beatKey,
	index,
	playing,
	changePlaying,
	showPlayer,
}: MyProps) {
	const [analyzerData, setAnalyzerData] = useState<AnalyzerData | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [timer, setTimer] = useState<number>(0);
	const audioElmRef = useRef<CustomHTMLAudioElement>(
		null as unknown as CustomHTMLAudioElement
	);

	const globalContext = useContext(GlobalContext);
	const volume = globalContext?.volume ?? 1; // Use default if null

	const audioUrl: string = audio;

	// Funkcja do przełączania odtwarzania/pauzy
	function toggleAudio() {
		if (audioElmRef.current === null) {
			return;
		}

		changePlaying(index);

		if (playing) {
			audioElmRef.current.pause();
		} else {
			if (
				audioElmRef.current._audioCtx &&
				audioElmRef.current._audioCtx.state === "suspended"
			) {
				audioElmRef.current._audioCtx.resume().then(() => {
					if (audioElmRef.current !== null) audioElmRef.current.play();
				});
			} else {
				audioElmRef.current.play();
			}
		}
	}

	const audioAnalyzer = () => {
		if (audioElmRef.current && !audioElmRef.current._sourceNode) {
			const audioCtx = new ((window as ExtendedWindow).AudioContext ||
				(window as ExtendedWindow).webkitAudioContext!)();
			const analyzer = audioCtx.createAnalyser();
			analyzer.fftSize = 2048;
			const bufferLength = analyzer.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			const source = audioCtx.createMediaElementSource(audioElmRef.current);
			source.connect(analyzer);
			source.connect(audioCtx.destination);

			// Poprawna obsługa zakończenia odtwarzania
			const handleEnded = () => {
				source.disconnect();
			};

			audioElmRef.current.addEventListener("ended", handleEnded);

			// Zapisz źródło i audioCtx w elemencie audio
			audioElmRef.current._sourceNode = source;
			audioElmRef.current._audioCtx = audioCtx;

			setAnalyzerData({ analyzer, bufferLength, dataArray });

			// Cleanup funkcja w przypadku ponownego wywołania
			return () => {
				audioElmRef.current?.removeEventListener("ended", handleEnded);
				source.disconnect();
			};
		}
	};

	useEffect(() => {
		if (!playing) return;

		const timer = setInterval(() => {
			setTimer((prevVal) => prevVal + 1);
		}, 50);

		return function () {
			clearInterval(timer);
		};
	}, [playing]);

	useEffect(() => {
		if (audioElmRef?.current === null) return;

		if (!playing) {
			audioElmRef.current.pause();
		}
	}, [playing]);

	// Efekt do inicjalizacji analizatora po załadowaniu audioUrl
	useEffect(() => {
		if (audioUrl) {
			audioAnalyzer();
		}
	}, [audioUrl]);

	useEffect(() => {
		if (!audioElmRef.current) return;

		const percentOfSong =
			(audioElmRef.current.currentTime / audioElmRef.current.duration) * 100;

		if (percentOfSong > 99.8) {
			audioElmRef.current.currentTime = 0;
			audioElmRef.current.pause();
			changePlaying(index);
		}
	}, [timer]);

	useEffect(() => {
		if (typeof volume === "string") {
			audioElmRef.current.volume = parseFloat(volume);
		}
	}, [volume]);

	return (
		<>
			<li className="flex flex-col gap-4">
				<div className="flex flex-col items-center md:justify-between md:flex-row group">
					<div className="flex flex-col items-center gap-4 md:flex-row">
						<span className="text-xl text-white/70 hidden md:inline">
							{index + 1}
						</span>
						<div className="relative cursor-pointer">
							<img
								src={img}
								alt={title}
								className="h-[60px] w-[60px] object-cover rounded"
							/>
							<div className="text-4xl absolute top-0 left-0 w-full h-full flex items-center justify-center md:opacity-0 bg-black/60 group-hover:opacity-100 duration-300">
								{playing ? (
									<button onClick={toggleAudio}>
										<FaPause className=" hover:text-purple-600 duration-300" />
									</button>
								) : (
									<button onClick={toggleAudio}>
										<FaPlay className=" hover:text-purple-600 duration-300" />
									</button>
								)}
							</div>
						</div>
						<p className="font-bold tracking-wider flex flex-col text-center gap-2 md:items-center md:text-left md:flex-row">
							{title}
							<span className="text-white/70 font-normal">{bpm} BPM,</span>
							<span className="text-white/70 font-normal">Key: {beatKey}</span>
						</p>
					</div>
					<div className="flex items-center gap-4 h-[60px]">
						{isFree ? (
							<DownloadButton downloadLink={audio}>
								<FaDownload />
								free
							</DownloadButton>
						) : (
							<BuyButton>Buy it</BuyButton>
						)}
					</div>
				</div>
				{analyzerData ? (
					playing ? (
						<BeatAnalyser
							className="h-[100px]"
							analyzerData={analyzerData}
							audioElmRef={audioElmRef}
						/>
					) : (
						<BeatAnalyser
							className="h-0"
							analyzerData={analyzerData}
							audioElmRef={audioElmRef}
						/>
					)
				) : null}
				<audio
					crossOrigin="anonymous"
					src={audioUrl}
					controls
					ref={audioElmRef}
					className="hidden"
				/>

				{showPlayer ? (
					<BeatPlayer
						audioElmRef={audioElmRef}
						toggleAudio={toggleAudio}
						img={img}
						title={title}
						playing={playing}
					/>
				) : null}
			</li>
		</>
	);
}

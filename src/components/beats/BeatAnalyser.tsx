import WaveForm from "./WaveForm";
import { RefObject, useState, useRef } from "react";

type AnalyserProps = {
	className?: string;
	analyzerData: {
		analyzer: AnalyserNode;
		bufferLength: number;
		dataArray: Uint8Array;
	};
	audioElmRef: RefObject<CustomHTMLAudioElement>;
};

interface CustomHTMLAudioElement extends HTMLAudioElement {
	_audioCtx?: AudioContext;
	_sourceNode?: MediaElementAudioSourceNode;
}

export default function BeatAnalyser({
	className,
	analyzerData,
	audioElmRef,
}: AnalyserProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setChangedTime] = useState<number>(0);
	const progressContainerRef = useRef<HTMLDivElement>(null);

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
		<div
			ref={progressContainerRef}
			onClick={handleProgressClick}
			className={`bg-white/10 rounded-lg duration-500 relative overflow-hidden cursor-pointer  ${className}`}>
			<div
				className="absolute top-0 left-0 h-full w-[0] bg-purple-600/40 z-10"
				style={{
					width: `${
						(audioElmRef.current.currentTime / audioElmRef.current.duration) *
						100
					}%`,
				}}></div>
			<WaveForm analyzerData={analyzerData} />
		</div>
	);
}

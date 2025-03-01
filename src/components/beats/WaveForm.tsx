import { useRef, useEffect } from "react";
import useSize from "./useSize";

type WaveFromProps = {
	analyzerData: {
		analyzer: AnalyserNode;
		bufferLength: number;
		dataArray: Uint8Array;
	};
};

function animateBars(
	analyser: AnalyserNode,
	canvas: HTMLCanvasElement,
	canvasCtx: CanvasRenderingContext2D,
	dataArray: Uint8Array,
	bufferLength: number
) {
	analyser.getByteFrequencyData(dataArray);

	canvasCtx.fillStyle = "#000";

	const HEIGHT = canvas.height / 1.5;

	const barWidth = Math.ceil(canvas.width / bufferLength) * 5;
	let barHeight;
	let x = 0;

	for (let i = 0; i < bufferLength; i++) {
		barHeight = (dataArray[i] / 255) * HEIGHT;
		canvasCtx.fillStyle = "white";
		canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

		x += barWidth + 1;
	}
}

const WaveForm = ({ analyzerData }: WaveFromProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const { dataArray, analyzer, bufferLength } = analyzerData;
	const [width, height] = useSize();

	const draw = (
		dataArray: Uint8Array,
		analyzer: AnalyserNode,
		bufferLength: number
	) => {
		const canvas = canvasRef.current;
		if (!canvas || !analyzer) return;
		const canvasCtx = canvas.getContext("2d");

		if (!canvasCtx) return;

		const animate = () => {
			requestAnimationFrame(animate);
			// eslint-disable-next-line no-self-assign
			canvas.width = canvas.width;
			canvasCtx.translate(0, canvas.offsetHeight / 2 - 0);
			animateBars(analyzer, canvas, canvasCtx, dataArray, bufferLength);
		};

		animate();
	};

	useEffect(() => {
		draw(dataArray, analyzer, bufferLength);
	}, [dataArray, analyzer, bufferLength]);

	return (
		<>
			<canvas
				style={{
					position: "absolute",
					bottom: "-40px",
					left: "0",
					width: "100%",
					height: "100px",
				}}
				ref={canvasRef}
				width={width}
				height={height}></canvas>
		</>
	);
};

export default WaveForm;

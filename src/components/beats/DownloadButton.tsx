import { ReactNode, useState } from "react";

type BeatButtonProps = {
	children: ReactNode;
	className?: string;
	downloadLink: string;
};

export default function BeatButton({
	children,
	className,
	downloadLink,
}: BeatButtonProps) {
	const [isDownloading, setIsDownloading] = useState<boolean>(false);

	const handleDownload = async () => {
		try {
			setIsDownloading(true)
			const response = await fetch(downloadLink);
			const blob = await response.blob();

			// Wyodrębnij nazwę pliku z linku

			if (downloadLink === undefined) return;

			const fileName = decodeURIComponent(
				downloadLink
					?.split("/")
					?.pop()
					?.split("?")[0]
					?.replace("beats%2F", "") || ""
			);

			// Utwórz link do pobrania
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = fileName || "file.mp3"; // Użyj wyodrębnionej nazwy pliku
			document.body.appendChild(link);
			link.click(); // Wymuś kliknięcie linku
			document.body.removeChild(link); // Usuń link z DOM
			window.URL.revokeObjectURL(downloadUrl); // Zwolnij pamięć
		} catch (error) {
			console.error("Błąd podczas pobierania pliku:", error);
		} finally {
			setIsDownloading(false)
		}
	};

	return (
		<button
			onClick={handleDownload} // Uruchom funkcję pobierania po kliknięciu
			className={`flex justify-center uppercase font-bold gap-1 min-h-[42px] min-w-[106px] py-2 px-6 rounded-md text-white/80 border bg-orange-700/20 border-orange-700 hover:bg-orange-700/40 duration-300 ${className}`}>
			{isDownloading ? <div className="loader w-[25px] bg-orange-700"></div>: children}
		</button>
		
	);
}

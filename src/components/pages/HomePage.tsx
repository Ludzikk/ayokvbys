import { useEffect } from "react";
import Header from "./Header";

export default function HomePage() {
	
	useEffect(() => {
		document.title = "ayokvbys - home"
	}, [])

	return (
		<>
			<Header />
		</>
	);
}

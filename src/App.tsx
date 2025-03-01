import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/pages/Layout";
import HomePage from "./components/pages/HomePage";
import PageNotFound from "./components/pages/PageNotFound";
import BeatsPage from "./components/pages/BeatsPage";
import LoginPage from "./components/pages/LoginPage";
import AddPage from "./components/pages/AddPage";
import { createContext, useEffect, useState } from "react";

import { Firestore } from "firebase/firestore";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { FirebaseStorage } from "firebase/storage";
import { db, auth, storage } from "./functions/firebase";

type GlobalContextType = {
	db: Firestore;
	auth: Auth;
	storage: FirebaseStorage;
	volume: string | null;
	changeVolume: (value: number) => void;
	authorized: string | null;
	updateAuth: (UID: string) => void;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export default function App() {
	const [authorized, setAuthorized] = useState<string | null>(null);
	const [volume, setVolume] = useState<string | null>(
		localStorage.getItem("volume")
	);

	function checkIfUserIsLoggedIn() {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setAuthorized(user.uid);
			}
		});
	}

	function changeVolume(value: number): void {
		localStorage.setItem("volume", `${value}`);
		setVolume(localStorage.getItem("volume"));
	}

	function updateAuth(UID: string) {
		setAuthorized(UID);
	}

	useEffect(() => {
		if (localStorage.getItem("volume") === null) {
			localStorage.setItem("volume", "1");
		}
	}, [volume]);

	useEffect(() => {
		checkIfUserIsLoggedIn();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				auth,
				db,
				storage,
				volume,
				changeVolume,
				authorized,
				updateAuth,
			}}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path="beats" element={<BeatsPage title={"beats"} />} />
						<Route
							path="free"
							element={<BeatsPage title={"free beats"} isFree={true} />}
						/>
						<Route path="add" element={<AddPage />} />
						<Route path="login" element={<LoginPage />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</GlobalContext.Provider>
	);
}

export { GlobalContext };

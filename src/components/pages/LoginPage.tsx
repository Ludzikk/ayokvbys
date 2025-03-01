import { GlobalContext } from "../../App";
import BackgroundHero from "../other/BackgroundHero";
import { FormEvent, useContext, useEffect } from "react";
import Button from "../other/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
	const globalContext = useContext(GlobalContext);
	const authorized = globalContext?.authorized ?? null;
	const updateAuth = globalContext?.updateAuth;
	const auth = globalContext?.auth;

	const linkClassNames =
		"bg-purple-600/20 border border-purple-600 rounded-md p-2 mb-4";

	function loginUserToWebsite(
		email: FormDataEntryValue,
		password: FormDataEntryValue
	) {
		if (auth === undefined) return;

		if (typeof email === "string" && typeof password === "string") {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					const user = userCredential.user;

					if (updateAuth !== undefined) {
						updateAuth(user.uid);
					}
				})
				.catch((error) => console.log(error));
		}
	}

	function loginUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const email = formData.get("email");
		const password = formData.get("password");

		if (email && password) {
			loginUserToWebsite(email, password);
		}
	}

	useEffect(() => {
		document.title = `ayokvbys - login`;
	}, []);

	if (authorized) {
		return <Navigate to="../add" replace={true} />;
	}

	return (
		<>
			<BackgroundHero />
			<main className="relative z-[1] flex flex-1">
				<div className="max-w-[1200px] w-full mx-auto px-2 flex flex-col justify-center">
					<form
						onSubmit={loginUser}
						className="bg-black/80 p-8 rounded-lg flex flex-col gap-2  mx-auto">
						<label htmlFor="email">E-mail</label>
						<input
							type="text"
							id="email"
							name="email"
							className={linkClassNames}
						/>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							className={linkClassNames}
						/>
						<Button>Login</Button>
					</form>
				</div>
			</main>
		</>
	);
}

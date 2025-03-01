import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import EmailForm from "../other/EmailForm";

export default function Layout() {
	return (
		<>
			<Nav />
			<Outlet />
			<EmailForm />
		</>
	);
}

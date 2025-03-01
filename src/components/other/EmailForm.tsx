import emailjs from "@emailjs/browser";
import { ChangeEvent, FormEvent, useState } from "react";
import { MdEmail } from "react-icons/md";
import Button from "./Button"

export default function EmailForm() {
	const [form, setForm] = useState({ email: "", message: "" });
	const [showForm, setShowForm] = useState(false);
	const [sending, setSending] = useState(false);

	const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setSending(true);

		emailjs
			.send("service_p84x7kg", "template_gudb53k", form, "1XmXO2QqBG5_ND_c2")
			.then(() => {
				setForm({ email: "", message: "" });
				setShowForm(false);
				setSending(false);
			});
	};

	return (
		<>
			<button
				onClick={() => setShowForm((prevVal) => !prevVal)}
				className="absolute bottom-0 right-0 p-4 m-4 bg-purple-600/60 hover:bg-purple-600/80 duration-300 cursor-pointer z-[50] rounded-full">
				<MdEmail />
			</button>
			{showForm ? (
				<form
					className="absolute bottom-[60px] right-0 p-4 m-4 bg-gray-200 text-black flex flex-col justify-center z-[50] rounded-lg"
					action=""
					onSubmit={handleSubmit}>
					<label htmlFor="email">Enter your email:</label>
					<input
						type="text"
						id="email"
						name="email"
						onChange={handleChange}
						className="bg-purple-600/20 border border-purple-600 rounded-md p-2 mb-4"
					/>
					<label htmlFor="message">Message:</label>
					<textarea
						name="message"
						id="message"
						onChange={handleChange}
						className="bg-purple-600/20 border border-purple-600 rounded-md p-2 mb-4 [resize:none] h-[100px]"></textarea>
					<Button className="lg:text-sm flex justify-center" type="submit">
						{sending ? (
							<div className="loader w-[25px] bg-purple-600"></div>
						) : (
							"Send msg"
						)}
					</Button>
				</form>
			) : null}
		</>
	);
}

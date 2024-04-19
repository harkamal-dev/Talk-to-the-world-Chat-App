import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { io } from "socket.io-client";
import { Input, CustomButton } from "components";

let socket;

const Login = () => {
	const [user, setUser] = useState("");

	useEffect(() => {}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(user);
		setUser("");
	};

	const handleChange = ({ target: { value } }) => {
		setUser(value);
	};

	return (
		<div className="w-full h-screen bg-backdropBg flex justify-center items-center ">
			<div className="w-1/2 h-1/2 bg-orangeBg rounded-2xl flex flex-col justify-evenly">
				<Typography variant="h4" component="h2" className="text-textBg text-center !font-bold">
					Talk To The World
				</Typography>

				<form id="loginForm" onSubmit={handleSubmit} className="w-full flex justify-center">
					<div className="flex flex-col gap-8 w-3/4">
						<Input label="Name" value={user} onChange={handleChange} />
						<CustomButton type="submit" label="SIGNUP" />
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;

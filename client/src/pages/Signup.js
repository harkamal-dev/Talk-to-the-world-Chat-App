import React, { useState } from "react";
import { Input, CustomButton, CustomTypography } from "components/";
import { signUpUser } from "apis/login";
import { signUpUserInitialValues } from "../constants";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Signup = () => {
	const [formData, setFormData] = useState(signUpUserInitialValues);

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSignup();
	};

	const handleChange = ({ target: { value, id } }) => {
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSignup = async () => {
		try {
			let res = await signUpUser(formData);
			toast("User created successfully.");
			setFormData(signUpUserInitialValues);
		} catch (error) {
			console.log(error);
			toast(error.response.data);
		}
	};

	return (
		<div className="w-full h-screen bg-primaryWhite flex justify-center items-center ">
			<div className="w-2/5 h-1/2 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl ">
				<CustomTypography className="ubuntu-medium" />

				<form id="loginForm" onSubmit={handleSubmit} className="w-full flex justify-center">
					<div className="flex flex-col gap-6 w-3/4">
						<Input label="Name" id="fullName" value={formData.fullName} onChange={handleChange} />
						<Input label="Email" id="email" value={formData.email} onChange={handleChange} />
						<Input label="Password" id="password" type="password" value={formData.password} onChange={handleChange} />
						<CustomButton type="submit" label="SIGNUP" />
					</div>
				</form>

				<div>
					<Link to="/">
						<CustomTypography label="Login here" variant="body1" className="cursor-pointer underline mt-4 ubuntu-medium" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;

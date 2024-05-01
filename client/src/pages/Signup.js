import React, { useState } from "react";
import { Input, CustomButton, CustomTypography } from "components/";
import { signUpUser } from "apis/login";
import { signUpUserInitialValues } from "../constants";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail } from "helpers";

const Signup = () => {
	const [formData, setFormData] = useState(signUpUserInitialValues);
	const [errors, setErrors] = useState({});
	const Navigate = useNavigate()

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
			if (!isValidEmail(formData?.email)) {
				setErrors({ ...errors, email: "Please type correct email." });
			} else {
				setErrors({});
				let res = await signUpUser(formData);
				toast("User created successfully.");
				Navigate("/");
				setFormData(signUpUserInitialValues);
			}
		} catch (error) {
			console.log(error);
			toast(error.response.data);
		}
	};

	return (
		<div className="w-full h-screen bg-primaryWhite flex justify-center items-center ">
			<div className="w-full m-6 md:m-0 md:w-2/5 p-6 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl ">
				<CustomTypography className="ubuntu-medium" wrapperClassName="mb-4" />

				<form id="loginForm" onSubmit={handleSubmit} className="w-full flex justify-center">
					<div className="flex flex-col gap-6 w-full lg:w-3/4">
						<Input variant="standard" label="Name" id="fullName" value={formData.fullName} onChange={handleChange} />
						<Input
							label="Email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							error={errors.email}
							helperText={errors.email}
							variant="standard"
						/>
						<Input
							label="Password"
							id="password"
							variant="standard"
							type="password"
							value={formData.password}
							onChange={handleChange}
						/>
						<CustomButton type="submit" label="SIGNUP" />
					</div>
				</form>

				<Link to="/">
					<CustomTypography
						label="Login here"
						variant="body1"
						className="cursor-pointer underline mt-4 ubuntu-medium"
						wrapperClassName="mt-4"
					/>
				</Link>
			</div>
		</div>
	);
};

export default Signup;

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "contexts/authContext";
import useToaster from "hooks/useToaster";
import { Input, CustomButton, CustomTypography } from "components/";
import { loginUser } from "apis/login";
import { loginUserInitialValues } from "../constants";

const Login = () => {
	const [formData, setFormData] = useState(loginUserInitialValues);
	const navigate = useNavigate();
	const { showToast } = useToaster();
	const { setUserDetails } = useContext(AuthContext);

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
			let {
				data: { user },
			} = await loginUser(formData);
			setUserDetails(user);
			showToast("User Login successfully.");
			navigate("/dashboard");
			setFormData(loginUserInitialValues);
		} catch (error) {
			console.log(error);
			showToast(error.response.data);
		}
	};

	return (
		<div className="w-full h-screen bg-primaryWhite flex justify-center items-center">
			<div className="w-full m-6 md:m-0 md:w-2/5 p-6 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl">
				<CustomTypography className="text-primaryWhite ubuntu-medium" wrapperClassName="mb-4" />

				<form id="loginForm" onSubmit={handleSubmit} className="w-full flex justify-center">
					<div className="flex flex-col gap-6 w-full lg:w-3/4">
						<Input label="Email" id="email" value={formData.email} onChange={handleChange} />
						<Input label="Password" id="password" type="password" value={formData.password} onChange={handleChange} />
						<CustomButton type="submit" label="LOGIN" />
					</div>
				</form>

				<div>
					<CustomTypography
						label="Don't have an account?"
						variant="body2"
						className="text-primaryWhite"
						wrapperClassName="mt-4"
					/>
					<Link to="/signup">
						<CustomTypography
							label="Signup here"
							variant="body1"
							className="cursor-pointer underline !mt-3 text-primaryWhite ubuntu-medium"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

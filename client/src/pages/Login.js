import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "contexts/authContext";
import useToaster from "hooks/useToaster";
import { Input, CustomButton, CustomTypography } from "components/";
import { loginUser } from "apis/login";
import { loginUserInitialValues } from "../constants";
import { isValidEmail } from "../helpers";
import GoogleSvgComponent from "../assets/icons/google";
import { googleLoginAPI, googleLoginUser } from "../apis/login";

const Login = () => {
	const [formData, setFormData] = useState(loginUserInitialValues);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const { showToast } = useToaster();
	const { setUserDetails } = useContext(AuthContext);

	const handleSubmit = (e) => {
		e.preventDefault();
		handleLogin();
	};

	const handleChange = ({ target: { value, id } }) => {
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleLogin = async () => {
		try {
			if (!isValidEmail(formData?.email)) {
				setErrors({ ...errors, email: "Please type correct email." });
			} else {
				setErrors({});
				let {
					data: { user },
				} = await loginUser({ ...formData, email: String(formData?.email).toLowerCase() });
				setUserDetails(user);
				showToast("User Login successfully.");
				navigate("/dashboard");
				setFormData(loginUserInitialValues);
			}
		} catch (error) {
			console.log(error);
			showToast(error.response.data);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			try {
				const {
					data: { email, name, picture },
				} = await googleLoginAPI(codeResponse);
				const {
					data: { user },
				} = await googleLoginUser({
					email,
					name,
					profilePhoto: picture,
				});
				setUserDetails(user);
				navigate("/dashboard");
			} catch (error) {
				console.log("Login Failed:", error);
			}
		},
		onError: (error) => console.log("Login Failed:", error),
	});

	return (
		<div className="w-full h-screen bg-primaryWhite flex justify-center items-center">
			<div className="w-full m-6 md:m-0 md:w-2/5 p-6 bg-primaryLightBg rounded-2xl flex flex-col justify-evenly shadow-xl">
				<CustomTypography className="text-primaryWhite ubuntu-medium" wrapperClassName="mb-4" />

				<form id="loginForm" onSubmit={handleSubmit} className="w-full flex justify-center">
					<div className="flex flex-col gap-6 w-full lg:w-3/4">
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
							type="password"
							variant="standard"
							value={formData.password}
							onChange={handleChange}
						/>
						<CustomButton type="submit" label="LOGIN" />
					</div>
				</form>
				<div className="flex justify-center pt-4">
					<CustomButton variant="outlined" size="small" onClick={googleLogin}>
						<div className="flex gap-2 items-center">
							<GoogleSvgComponent />
							<CustomTypography variant="body2" label="Sign in with Google" />
						</div>
					</CustomButton>
				</div>
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

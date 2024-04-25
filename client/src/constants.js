const signUpUserInitialValues = {
	fullName: "",
	email: "",
	password: "",
};

const loginUserInitialValues = {
	email: "hk@gmail.com",
	password: "",
};

const BASE_URL = process.env.BASE_URL

export { signUpUserInitialValues, loginUserInitialValues, BASE_URL };

const signUpUserInitialValues = {
	fullName: "",
	email: "",
	password: "",
};

const loginUserInitialValues = {
	email: "",
	password: "",
};

const LOGIN_TYPE = {
	normal: "normal",
	gAuth: "gAuth",
};

const BASE_URL = process.env.BASE_URL;
const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;

export { signUpUserInitialValues, loginUserInitialValues, BASE_URL, GOOGLE_AUTH_CLIENT_ID, LOGIN_TYPE };

import axios from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Access-Control-Allow-Origin": "*", // Allow requests from any origin
	},
});

const signUpUser = (payload) => {
	return axiosInstance.post("/api/register", payload);
};

const loginUser = (payload) => {
	return axiosInstance.post("/api/login", payload);
};

const getUsers = () => {
	return axiosInstance.get("/api/users");
};

const getUserfromToken = (payload) => {
	return axiosInstance.get(`/api/getUserFromToken/${payload?.token}`, { params: payload });
};

const logOutUser = (id) => {
	return axiosInstance.post(`/api/logoutUser/${id}`);
};

const googleLoginAPI = (codeResponse) => {
	return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
		headers: {
			Authorization: `Bearer ${codeResponse.access_token}`,
			Accept: "application/json",
		},
	});
};

const googleLoginUser = (payload) => {
	return axiosInstance.post("/api/googleAuth/login", payload);
};

export { signUpUser, loginUser, getUsers, getUserfromToken, logOutUser, googleLoginAPI, googleLoginUser };

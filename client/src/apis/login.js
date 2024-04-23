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

const logoutUser = (id) => {
	return axiosInstance.post(`/api/logoutUser/${id}`);
};

export { signUpUser, loginUser, getUsers, getUserfromToken, logoutUser };

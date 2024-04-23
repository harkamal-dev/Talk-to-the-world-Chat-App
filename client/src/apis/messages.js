import axios from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Access-Control-Allow-Origin": "*", // Allow requests from any origin
	},
});

const sendMessageApi = (payload) => {
	return axiosInstance.post("/api/message", payload);
};

const getMessages = ({ convId }) => {
	return axiosInstance.get(`/api/message/${convId}`);
};

export { sendMessageApi, getMessages };

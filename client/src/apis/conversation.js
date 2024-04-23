import axios from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Access-Control-Allow-Origin": "*", // Allow requests from any origin
	},
});

const createConversation = (payload) => {
	return axiosInstance.post("/api/conversation", payload);
};

const getConversations = (userId) => {
	return axiosInstance.get(`/api/conversation/${userId}`);
};

export { createConversation, getConversations };

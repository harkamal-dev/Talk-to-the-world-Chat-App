import { createTheme } from "@mui/material";

const checkIsOnlineUsers = (userId, onlineUsers, selectedConversation) => {
	if (!selectedConversation) return false;
	if (onlineUsers.length === 1 && onlineUsers[0]["userId"] === userId) {
		return false;
	}
	if (selectedConversation) {
		let isOnlineUser = onlineUsers.find((user) => user.userId === selectedConversation.user.id);
		return !!isOnlineUser;
	}
	return true;
};

const muiTheme = createTheme({
	palette: {
		primary: {
			main: "#266150",
		},
	},
});

const isValidEmail = (email) => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
};

const checkIfUserOnMobile = () => {
	let width = window.innerWidth;
	return width < 768;
};

export { checkIsOnlineUsers, muiTheme, isValidEmail, checkIfUserOnMobile };

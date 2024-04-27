import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import { io } from "socket.io-client";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Dashboard from "pages/Dashboard";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "contexts/socketContext";
import { NoMatch, ProtectedRoute } from "components";
import { getUserfromToken, logOutUser } from "apis/login";
import useToaster from "hooks/useToaster";
import { BASE_URL, GOOGLE_AUTH_CLIENT_ID } from "./constants";
import { muiTheme } from "helpers";

const App = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { showToast } = useToaster();
	const Navigate = useNavigate();

	useEffect(() => {
		const getUserFromToken = async (token) => {
			try {
				let { data } = await getUserfromToken({ token });
				setCurrentUser(data);
			} catch (error) {
				showToast(error?.response?.data);
				sessionStorage.removeItem("token");
				Navigate("/");
			}
		};

		let token = sessionStorage.getItem("token");
		if (token) {
			getUserFromToken(token);
		}
		setSocket(io(BASE_URL));
	}, []);

	useEffect(() => {
		if (socket && currentUser) {
			socket.emit("addUser", currentUser?._id);
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});
		}
	}, [socket, currentUser]);

	const setUserDetails = (user) => {
		setCurrentUser(user);
		sessionStorage.setItem("token", user.token);
	};

	const logoutUser = async () => {
		try {
			await logOutUser(currentUser._id);
			sessionStorage.removeItem("token");
			Navigate("/");
			showToast("Logout successfully. Will see you again.");
		} catch (error) {
			showToast(error?.response?.data);
		}
	};

	return (
		<>
			<ThemeProvider theme={muiTheme}>
				<GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
					<AuthContext.Provider
						value={{
							currentUser,
							setUserDetails,
							logoutUser,
						}}
					>
						<SocketContext.Provider
							value={{
								socket,
								onlineUsers,
							}}
						>
							<Routes>
								<Route path="/" element={<Login />} />
								<Route path="/signup" element={<Signup />} />
								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<Dashboard />
										</ProtectedRoute>
									}
								/>
								<Route path="*" element={<NoMatch />} />
							</Routes>
						</SocketContext.Provider>
						<ToastContainer position="bottom-right" progressStyle={{ background: muiTheme.palette.primary.main }} />
					</AuthContext.Provider>
				</GoogleOAuthProvider>
			</ThemeProvider>
		</>
	);
};

export default App;

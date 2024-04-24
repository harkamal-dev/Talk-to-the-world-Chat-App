import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { io } from "socket.io-client";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Dashboard from "pages/Dashboard";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "./context/socketContext";
import NoMatch from "components/NoMatch";
import { getUserfromToken } from "./apis/login";
import useToaster from "hooks/useToaster";
import ProtectedRoute from "./components/ProtectedRoute";
import { BASE_URL } from "./constants";
import { muiTheme } from "./helpers";

const App = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { showToast } = useToaster();

	useEffect(() => {
		const getUserFromToken = async (token) => {
			try {
				let { data } = await getUserfromToken({ token });
				setCurrentUser(data);
			} catch (error) {
				showToast(error?.response?.data);
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

	return (
		<>
			<ThemeProvider theme={muiTheme}>
				<AuthContext.Provider
					value={{
						currentUser,
						setUserDetails,
					}}
				>
					<SocketContext.Provider
						value={{
							socket,
							onlineUsers,
						}}
					>
						<BrowserRouter>
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
						</BrowserRouter>
					</SocketContext.Provider>
					<ToastContainer position="bottom-right" progressStyle={{ background: muiTheme.palette.primary.main }} />
				</AuthContext.Provider>
			</ThemeProvider>
		</>
	);
};

export default App;

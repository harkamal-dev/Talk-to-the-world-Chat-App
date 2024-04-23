import React, { useEffect, useState } from "react";
import Signup from "pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import { AuthContext } from "contexts/authContext";
import NoMatch from "components/NoMatch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getUserfromToken } from "./apis/login";
import useToaster from "hooks/useToaster";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const { showToast } = useToaster();

	const theme = createTheme({
		palette: {
			primary: {
				main: "#266150",
			},
		},
	});

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
	}, []);

	const setUserDetails = (user) => {
		setCurrentUser(user);
		sessionStorage.setItem("token", user.token);
	};

	return (
		<>
			<ThemeProvider theme={theme}>
				<AuthContext.Provider
					value={{
						currentUser,
						setUserDetails,
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
					<ToastContainer position="bottom-right" progressStyle={{ background: theme.palette.primary.main }} />
				</AuthContext.Provider>
			</ThemeProvider>
		</>
	);
};

export default App;

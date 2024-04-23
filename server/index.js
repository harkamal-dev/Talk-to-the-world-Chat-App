import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
// DB imports
import connectDB from "./db/connection.js";
import Users from "./models/users.js";
import Conversations from "./models/conversations.js";
import Messages from "./models/messages.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_VERY_SECRET_KEY";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:9000",
	},
});

// Middlewares
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:9000",
	})
);

app.get("/", (_, res) => {
	res.send("Talk to the world is running perfectly. ");
});

app.post("/api/register", async (req, res, next) => {
	try {
		const { fullName, email, password } = req.body;

		if (!fullName || !email || !password) {
			res.status(400).send("Enter valid data.");
		} else {
			const isEmailExists = await Users.findOne({ email });
			if (isEmailExists) {
				res.status(400).send("User elready exists.");
			} else {
				const newUser = new Users({ fullName, email });
				bcryptjs.hash(password, 10, (err, hashedPW) => {
					newUser.set("password", hashedPW);
					newUser.save();
					next();
				});
				return res.status(200).send("User created.");
			}
		}
	} catch (error) {
		res.status(400).send("Error");
	}
});

app.post("/api/login", async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).send("Please fill all required fields.");
		} else {
			const user = await Users.findOne({ email });
			if (!user) {
				res.status(400).send("User doesn't exist.");
			} else {
				const validateUser = await bcryptjs.compare(password, user.password);
				if (!validateUser) {
					res.status(400).send("User email or password is incorrect.");
				} else {
					const payload = {
						userId: user._id,
						email: user.email,
					};
					jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
						if (err) {
							console.error("Error signing token:", err);
							res.status(500).send("Error signing token.");
						} else {
							user.token = token;
							await user.save();
							res.status(200).json({ user, token });
						}
					});
				}
			}
		}
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).send("Something wrong.");
	}
});

app.get("/api/users", async (req, res) => {
	try {
		let users = await Users.find();
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

app.get("/api/getUserFromToken/:token", async (req, res) => {
	try {
		let token = req.params.token;
		const isValidToken = jwt.verify(token, JWT_SECRET_KEY);
		if (isValidToken) {
			let user = await Users.findOne({ email: isValidToken.email });
			return res.status(200).json(user);
		} else {
			return res.status(400).send("Token expired. Please login again.");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

app.post("/api/logoutUser/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		let userDetails = await Users.findOne({ _id: userId });
		await Users.updateOne(
			{ _id: userDetails._id },
			{
				$set: { token: null },
			}
		);
		userDetails.save();
		res.status(200).send("Logout Successfully");
	} catch (error) {
		console.log(error);
		res.status(400).send("Something Wrong:");
	}
});

app.post("/api/conversation", async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		let alreadyPresentConv = await Conversations.findOne({ members: { $all: [senderId, receiverId] } });

		let conv;
		if (alreadyPresentConv) {
			conv = alreadyPresentConv;
		} else {
			const newConversation = new Conversations({ members: [senderId, receiverId] });
			await newConversation.save();
			let resConversation = await Conversations.findOne({ members: { $all: [senderId, receiverId] } });
			conv = resConversation;
		}

		let receiverUser = await Users.findById(receiverId);
		let formattedResponseData = {
			user: {
				name: receiverUser.fullName,
				email: receiverUser.email,
				id: receiverUser._id,
			},
			conversationId: conv._id,
		};
		res.status(200).json(formattedResponseData);
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

app.get("/api/conversation/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		const conversationList = await Conversations.find({ members: { $in: [userId] } });
		const finalRes = await Promise.all(
			conversationList.map(async (conv) => {
				let receiverId = conv.members.find((el) => el !== userId);
				let receiverUser = await Users.findById(receiverId);
				return {
					user: {
						name: receiverUser.fullName,
						email: receiverUser.email,
						id: receiverUser._id,
					},
					conversationId: conv._id,
				};
			})
		);
		res.status(200).json(finalRes);
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

app.post("/api/message", async (req, res) => {
	try {
		const { senderId, receiverId, conversationId, message } = req.body;
		if (!message || !senderId || !receiverId || !conversationId) {
			res.status(400).send("Please fill all the details.");
		} else {
			let newMessage = new Messages({ senderId, receiverId, message, conversationId });
			await newMessage.save();
			res.status(200).json({ newMessage });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

app.get("/api/message/:conversationId", async (req, res) => {
	try {
		const conversationId = req.params.conversationId;
		const messagesList = await Messages.find({ conversationId });

		res.status(200).json(messagesList);
	} catch (error) {
		console.log(error);
		res.status(500).send("Something wrong.");
	}
});

// Web Sockets
let onlineUsers = [];
io.on("connection", (socket) => {
	socket.on("addUser", (userId) => {
		let isUserExist = onlineUsers.find((el) => el.userId === userId);
		if (!isUserExist) {
			let userSocketMap = { userId, socketId: socket.id };
			onlineUsers.push(userSocketMap);
			console.log(onlineUsers);
			io.emit("getOnlineUsers", onlineUsers);
		}
	});

	socket.on("disconnect", () => {
		onlineUsers = onlineUsers.filter((el) => el.socketId !== socket.id);
		io.emit("getOnlineUsers", onlineUsers);
	});

	socket.on("sendMessage", async (newMessage) => {
		let findOnlineUser = onlineUsers.find((user) => user.userId === newMessage.receiverId);
		if (findOnlineUser) {
			io.to(findOnlineUser.socketId).emit("getNewMessages", newMessage);
		}
	});
});

// DB Connect
connectDB().then(() =>
	server.listen(8089, () => {
		console.log("server running at http://localhost:8089");
	})
);

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// DB imports
import connectDB from "./db/connection.js";
import Users from "./models/users.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hi");
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
				res.status(400).send("User doesn't exists.");
			} else {
				const validateUser = await bcryptjs.compare(password, user.password);
				if (!validateUser) {
					res.status(400).send("User email or password is incorrect.");
				} else {
					const payload = {
						userId: user._id,
						email: user.email,
					};
					const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "hduirbciugr4yv4yyr";
					jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
						await Users.updateOne(
							{ _id: user._id },
							{
								$set: { token },
							}
						);
						user.save();
						next();
					});
					res.status(200).json({ user });
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Something wrong.");
	}
});

// io.on("connection", (socket) => {
// 	console.log(socket.id);

// 	socket.on("chat message", (msg, room) => {
// 		console.log({ msg, room });
// 		if (room === "") {
// 			io.emit("chat message", msg);
// 		} else {
// 			socket.to(room).emit("chat message", msg);
// 		}
// 	});

// 	socket.on("joinRoom", (name) => {
// 		socket.join(room);
// 	});

// 	socket.on("sendMsgInRoom", (msg, name) => {
// 		io.to(name).emit("chat message", msg);
// 	});
// });

connectDB().then(() =>
	server.listen(8089, () => {
		console.log("server running at http://localhost:8089");
	})
);

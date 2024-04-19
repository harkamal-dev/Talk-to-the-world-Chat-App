import mongoose from "mongoose";

const URL =
	"mongodb+srv://hs976034:Hks12345678@talktotheworld.gpjntbv.mongodb.net/?retryWrites=true&w=majority&appName=TalkToTheWorld";

const connectDB = async () => {
	try {
		await mongoose.connect(URL);
		console.log("DB Connected");
	} catch (err) {
		console.error("Error connecting to database:", err);
		throw new Error(err);
	}
};

export default connectDB;

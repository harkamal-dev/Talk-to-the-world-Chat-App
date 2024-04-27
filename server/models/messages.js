import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
	conversationId: {
		type: String,
	},
	senderId: {
		type: String,
	},
	receiverId: {
		type: String,
	},
	message: {
		type: String,
	},
	dateTime: {
		type: Date,
	},
});

const Messages = mongoose.model("Message", messageSchema);
export default Messages;

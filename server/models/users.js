import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: false,
	},
	isGoogleAuth: {
		type: Boolean,
	},
	profilePhoto: {
		type: String,
	},
	token: {
		type: String,
	},
});

const Users = mongoose.model("User", userSchema);
export default Users;

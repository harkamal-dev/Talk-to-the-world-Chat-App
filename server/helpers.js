import moment from "moment-timezone";

const formatIST = (date) => {
	return moment
		.utc(date ?? moment())
		.tz("Asia/Kolkata")
		.format();
};

const getFormattedDateTime = (date) => {
	return moment(formatIST(date ?? moment())).format("MMMM Do, h:mm:ss a");
};

export { formatIST, getFormattedDateTime };

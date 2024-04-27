import moment from "moment-timezone";

const formatIST = (date) => {
	return moment.utc(date ?? moment()).tz("Asia/Kolkata").format();
};

export { formatIST };

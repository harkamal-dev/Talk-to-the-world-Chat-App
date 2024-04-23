import React from "react";
import { Avatar } from "@mui/material";

const ProfileAvatar = ({ label, w = 56, h = 56 }) => {
	function stringToColor(string) {
		let hash = 0;
		let i;

		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = "#";

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}

		return color;
	}

	function stringAvatar(name) {
		const words = name?.toUpperCase()?.split(" ") ?? [];
		let initials;

		if (words.length === 1) {
			initials = name.slice(0, 1);
		} else {
			initials = words
				.filter((i, index) => index < 2)
				.map((word) => word[0])
				.join("");
		}

		return {
			sx: {
				bgcolor: stringToColor(name),
				width: w,
				height: h,
			},
			children: initials,
		};
	}

	return (
		<div className="border border-primaryDarkBg p-[2px] rounded-full">
			<Avatar {...stringAvatar(label)} />
		</div>
	);
};

export default ProfileAvatar;

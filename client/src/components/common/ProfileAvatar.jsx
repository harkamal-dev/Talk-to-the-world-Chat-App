import React from "react";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

const ProfileAvatar = ({ label, w = 44, h = 44, isOnline = false }) => {
	const StyledBadge = styled(Badge)(({ theme }) => ({
		"& .MuiBadge-badge": {
			backgroundColor: "#44b700",
			color: "#44b700",
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			"&::after": {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				borderRadius: "50%",
				animation: "ripple 2s infinite ease-in-out",
				border: "1px solid currentColor",
				content: '""',
			},
		},
		"@keyframes ripple": {
			"0%": {
				transform: "scale(.8)",
				opacity: 1,
			},
			"100%": {
				transform: "scale(2.4)",
				opacity: 0,
			},
		},
	}));

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
		<div className="border border-primaryLightBg p-[2px] rounded-full">
			{isOnline ? (
				<StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
					<Avatar {...stringAvatar(label)} />
				</StyledBadge>
			) : (
				<Avatar {...stringAvatar(label)} />
			)}
		</div>
	);
};

export default ProfileAvatar;

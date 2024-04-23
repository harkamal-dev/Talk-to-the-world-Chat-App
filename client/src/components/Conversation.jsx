import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "contexts/authContext";
import classNames from "classnames";
import ProfileAvatar from "./ProfileAvatar";
import CustomTypography from "./Typography";
import CustomButton from "./Button";
import useToaster from "hooks/useToaster";
import { logoutUser } from "apis/login";

const Conversation = ({ convData, isAdmin = false, setSelectedConversation, className }) => {
	const { currentUser } = useContext(AuthContext);
	const Navigate = useNavigate();
	const { showToast } = useToaster();

	const getConditionalAvatar = () => {
		if (isAdmin && !currentUser) {
			return null;
		}
		if (!isAdmin && !convData) {
			return null;
		}
		return <ProfileAvatar label={isAdmin ? currentUser?.fullName : convData.user.name} />;
	};

	const logOutUser = () => {
		logoutUser(currentUser._id);
		sessionStorage.removeItem("token");
		Navigate("/");
		showToast("Logout successfully. Will see you soon.");
	};

	return (
		<div
			className={classNames(
				"h-24 w-full p-4 flex items-center justify-between gap-4 overflow-x-auto overflow-y-hidden useScrollbar border-b border-primaryLightBg",
				{
					"cursor-pointer hover:bg-secondaryLightBg": !isAdmin,
				},
				className
			)}
			{...(!isAdmin && { onClick: () => setSelectedConversation(convData) })}
		>
			<div className="flex gap-4 items-center">
				{getConditionalAvatar()}
				<div>
					<CustomTypography label={isAdmin ? "Admin" : convData.user.name} variant="body1" className="text-start ubuntu-medium" />
					<CustomTypography label={isAdmin ? currentUser?.email : convData.user.email} variant="body2" />
				</div>
			</div>

			{isAdmin && (
				<div className="m-4">
					<CustomButton label="Logout" size="small" onClick={logOutUser} />
				</div>
			)}
		</div>
	);
};

export default Conversation;

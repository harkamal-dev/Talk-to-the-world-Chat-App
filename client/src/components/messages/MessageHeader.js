import React, { useContext } from "react";
import { AddIcCall, ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import { ProfileAvatar, CustomTypography } from "components";
import { checkIsOnlineUsers } from "helpers";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "contexts/socketContext";
import useToaster from "hooks/useToaster";

const MessageHeader = ({ selectedConversation, setIsShowMessagesUI }) => {
	const { currentUser } = useContext(AuthContext);
	const { onlineUsers } = useContext(SocketContext);
	const { showToast } = useToaster();

	const handleCallClick = () => {
		showToast("This feature is not developed yet. Will be added in future. Stay tuned.");
	};

	return (
		<div
			className={classNames(
				"flex gap-1 lg:gap-4 items-center mb-4 bg-secondaryLightBg p-2 pl-1 lg:pl-4 pr-4 lg:pr-8 rounded-full",
				{
					"justify-center": !selectedConversation,
					"justify-between": selectedConversation,
				}
			)}
		>
			<div
				className={classNames("flex gap-2 lg:gap-4 items-center", {
					"justify-center": !selectedConversation,
					"justify-start": selectedConversation,
				})}
			>
				<IconButton
					onClick={() => setIsShowMessagesUI(false)}
					color="primary"
					className="!text-primaryDarkBg h-full lg:!hidden"
					aria-label="back"
				>
					<ArrowBack />
				</IconButton>
				{selectedConversation && (
					<ProfileAvatar
						label={selectedConversation?.user?.name}
						w={40}
						h={40}
						isOnline={!!checkIsOnlineUsers(currentUser?._id, onlineUsers, selectedConversation)}
					/>
				)}
				<div className="flex items-baseline gap-2">
					<CustomTypography
						label={selectedConversation?.user?.name ?? "Select a conversation to start chat"}
						variant="h6"
						className="ubuntu-medium"
					/>
					{!!checkIsOnlineUsers(currentUser?._id, onlineUsers, selectedConversation) && (
						<CustomTypography label="(Online)" variant="caption" wrapperClassName="h-full" />
					)}
				</div>
			</div>
			<IconButton onClick={handleCallClick} color="primary" aria-label="call">
				<AddIcCall
					className={classNames("text-textBlack cursor-pointer hover:!text-hoverBg hover:transition-transform", {
						"!hidden": !selectedConversation,
					})}
				/>
			</IconButton>
		</div>
	);
};

export default MessageHeader;

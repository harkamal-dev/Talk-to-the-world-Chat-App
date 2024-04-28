import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "contexts/socketContext";
import useToaster from "hooks/useToaster";
import { checkIsOnlineUsers } from "helpers";
import { ProfileAvatar, CustomTypography, CustomButton, Skeleton } from "components";

const Conversation = ({ convData, isAdmin = false, setSelectedConversation, className, isConversationListLoading }) => {
	const Navigate = useNavigate();
	const { currentUser, logoutUser } = useContext(AuthContext);
	const { showToast } = useToaster();
	const { onlineUsers } = useContext(SocketContext);

	const getConditionalAvatar = () => {
		if (isConversationListLoading)
			return (
				<Skeleton
					variant="avatar"
					wrapperClassName={classNames({
						hidden: isAdmin,
					})}
				/>
			);
		if (isAdmin && !currentUser) {
			return null;
		}
		if (!isAdmin && !convData) {
			return null;
		}
		return (
			<ProfileAvatar
				label={isAdmin ? currentUser?.fullName : convData?.user?.name}
				isOnline={!!checkIsOnlineUsers(currentUser?._id, onlineUsers, convData)}
				profilePhoto={isAdmin ? currentUser?.profilePhoto : convData?.user?.profilePhoto}
			/>
		);
	};

	const getLastMessageUI = () => {
		if (isAdmin) {
			return currentUser?.email;
		} else if (!convData?.lastMessage) {
			return "";
		} else if (convData?.lastMessage?.senderId === currentUser._id) {
			return `You: ${(convData?.lastMessage?.message || "").slice(0, 15)}${
				convData?.lastMessage?.message?.length > 15 ? "..." : ""
			}`;
		} else {
			 return `${convData?.user?.name}: ${(convData?.lastMessage?.message || "").slice(0, 15)}${
				convData?.lastMessage?.message?.length > 15 ? "..." : ""
			}`;
		}
	};

	return (
		<div
			className={classNames(
				"h-24 w-full p-4 flex items-center justify-between gap-4 overflow-x-auto overflow-y-hidden useScrollbar border-b border-primaryLightBg",
				{
					"cursor-pointer hover:bg-secondaryLightBg": !isAdmin && !isConversationListLoading,
				},
				className
			)}
			{...(!isAdmin && !isConversationListLoading && { onClick: () => setSelectedConversation(convData) })}
		>
			<div className="flex gap-2 lg:gap-4 items-center w-full">
				{getConditionalAvatar()}
				<div className="flex-1">
					<div className="flex gap-2 items-center">
						{!isConversationListLoading ? (
							<div className="flex justify-between items-center w-full">
								<CustomTypography
									label={isAdmin ? "Admin" : convData?.user?.name}
									variant="body1"
									className="text-start ubuntu-medium"
								/>
								<CustomTypography
									label={convData?.lastMessage?.dateTime ?? ""}
									variant="caption"
									className={classNames("text-end break-words", {
										"!text-primaryDarkBg": !isAdmin,
										hidden: isAdmin,
									})}
									wrapperClassName="flex-1"
								/>
							</div>
						) : (
							<Skeleton
								wrapperClassName={classNames({
									hidden: isAdmin,
								})}
							/>
						)}
					</div>
					{!isConversationListLoading ? (
						<CustomTypography
							label={getLastMessageUI()}
							variant="body2"
							className={classNames("text-start break-words", {
								"!text-primaryDarkBg": !isAdmin,
							})}
						/>
					) : (
						<Skeleton
							variant="text"
							wrapperClassName={classNames({
								hidden: isAdmin,
							})}
						/>
					)}
				</div>
			</div>

			{isAdmin && (
				<div className="m-4">
					<CustomButton label="Logout" size="small" onClick={logoutUser} />
				</div>
			)}
		</div>
	);
};

export default Conversation;

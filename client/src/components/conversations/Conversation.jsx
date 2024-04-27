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
			<div className="flex gap-2 lg:gap-4 items-center">
				{getConditionalAvatar()}
				<div>
					<div className="flex gap-2 items-center">
						{!isConversationListLoading ? (
							<CustomTypography
								label={isAdmin ? "Admin" : convData?.user?.name}
								variant="body1"
								className="text-start ubuntu-medium"
							/>
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
							label={isAdmin ? currentUser?.email : convData?.lastMessage?.message ?? ""}
							variant="body2"
							className={classNames("text-start break-words", {
								"!text-primaryDarkBg" : !isAdmin
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

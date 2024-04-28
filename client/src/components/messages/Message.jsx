import classNames from "classnames";
import React from "react";
import { CustomTypography, Skeleton } from "components";

const Message = ({ message, isAdmin, isMessagesListLoading }) => {
	return (
		<div
			className={classNames("flex justify-start p-1", {
				"justify-end": isAdmin,
			})}
		>
			<div
				className={classNames("min-w-[10rem] lg:min-w-[20rem] max-w-[15rem] lg:max-w-[30rem] rounded-xl shadow-md", {
					"bg-primaryLightBg rounded-tl-none": !isAdmin,
					"bg-primaryDarkBg text-primaryWhite rounded-br-none": isAdmin && !isMessagesListLoading,
					"p-1.5 lg:p-2": !isMessagesListLoading,
				})}
			>
				{!isMessagesListLoading && message ? (
					<>
						<CustomTypography
							className={classNames("text-start", {
								"!text-textBlack": !isAdmin,
								"!text-primaryWhite": isAdmin,
							})}
							variant="body1"
							label={message.message}
						/>
						<CustomTypography
							className={classNames("text-end !text-[0.6rem] lg:!text-xs", {
								"!text-textBlack": !isAdmin,
								"!text-primaryWhite": isAdmin,
							})}
							variant="caption"
							label={message?.dateTime}
						/>
					</>
				) : (
					<Skeleton wrapperClassName="!p-0" />
				)}
			</div>
		</div>
	);
};

export default Message;

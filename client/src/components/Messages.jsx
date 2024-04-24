import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { AddIcCall, Send, ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CustomTypography from "./Typography";
import Message from "./Message";
import Input from "./Input";
import ProfileAvatar from "./ProfileAvatar";
import { getMessages, sendMessageApi } from "apis/messages";
import useToaster from "hooks/useToaster";
import { AuthContext } from "contexts/authContext";
import { BASE_URL } from "../constants";
import { io } from "socket.io-client";

const Messages = ({ wrapperClassName, selectedConversation, setIsShowMessagesUI }) => {
	const [userInput, setuserInput] = useState("");
	const [messagesList, setMessagesList] = useState([]);
	const bottomScrollViewRef = useRef(null);
	const { currentUser } = useContext(AuthContext);
	const { showToast } = useToaster();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		setSocket(io(BASE_URL));
	}, []);

	useEffect(() => {
		if (socket && currentUser) {
			socket.emit("addUser", currentUser?._id);
			socket.on("getOnlineUsers", (users) => {
				console.log({ users });
			});

			socket.on("getNewMessages", (message) => {
				setMessagesList((prevMessages) => [...prevMessages, message]);
			});
		}
	}, [socket, currentUser]);

	useEffect(() => {
		if (bottomScrollViewRef.current) {
			bottomScrollViewRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [selectedConversation, messagesList]);

	const fetchMessages = useCallback(
		async (selectedConversation) => {
			try {
				let { data } = await getMessages({ convId: selectedConversation?.conversationId });
				setMessagesList(data);
			} catch (error) {
				showToast(error);
			}
		},
		[selectedConversation]
	);

	useEffect(() => {
		if (selectedConversation) {
			fetchMessages(selectedConversation);
		}
	}, [selectedConversation]);

	const sendMessage = useCallback(async () => {
		try {
			let payload = {
				conversationId: selectedConversation?.conversationId,
				senderId: currentUser?._id,
				receiverId: selectedConversation?.user?.id,
				message: userInput,
			};
			socket.emit("sendMessage", payload);
			let { data } = await sendMessageApi(payload);
			setuserInput("");
			fetchMessages(selectedConversation);
		} catch (error) {
			showToast(error);
		}
	}, [selectedConversation, userInput]);

	const handleMessageChange = ({ target: { value } }) => {
		setuserInput(value);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!!userInput) {
			sendMessage();
		}
	};

	return (
		<div className={classNames("p-2 lg:p-6", wrapperClassName)}>
			<div
				className={classNames("flex gap-4 items-center mb-4 bg-secondaryLightBg p-2 pl-4 pr-8 rounded-full", {
					"justify-center": !selectedConversation,
					"justify-between": selectedConversation,
				})}
			>
				<div
					className={classNames("flex gap-4 items-center", {
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
					{selectedConversation && <ProfileAvatar label={selectedConversation?.user?.name} w={40} h={40} />}
					<CustomTypography
						label={selectedConversation?.user?.name ?? "Select a conversation to start chat"}
						variant="h6"
						className="ubuntu-medium"
					/>
				</div>
				<AddIcCall
					className={classNames("text-textBlack cursor-pointer hover:!text-hoverBg hover:transition-transform", {
						"!hidden": !selectedConversation,
					})}
				/>
			</div>

			{selectedConversation && (
				<>
					<div className="shadow-sm h-[calc(100vh-11rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-2 overflow-y-auto useScrollbar mb-6">
						{!!messagesList.length ? (
							messagesList.map((message) => (
								<Message message={message} key={message._id} isAdmin={message.senderId === currentUser._id} />
							))
						) : (
							<CustomTypography
								wrapperClassName="h-full flex items-center justify-center"
								label="Be the first to send the message"
								variant="h6"
							/>
						)}
						<label ref={bottomScrollViewRef} />
					</div>

					<form className="flex gap-2 lg:gap-6" onSubmit={handleSendMessage}>
						<Input
							hiddenLabel
							label=""
							value={userInput}
							onChange={handleMessageChange}
							placeholder="Type a message"
							size="small"
							autoFocus
						/>
						<IconButton type="submit" color="primary" className="!text-primaryDarkBg h-full" aria-label="send message">
							<Send className="!text-3xl" />
						</IconButton>
					</form>
				</>
			)}
		</div>
	);
};

export default Messages;

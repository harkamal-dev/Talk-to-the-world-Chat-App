import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Send } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CustomTypography, Input } from "components";
import { getMessages, sendMessageApi } from "apis/messages";
import useToaster from "hooks/useToaster";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "contexts/socketContext";
import MessageHeader from "./MessageHeader";

const Messages = ({ wrapperClassName, selectedConversation, setIsShowMessagesUI }) => {
	const [userInput, setuserInput] = useState("");
	const [messagesList, setMessagesList] = useState([]);
	const bottomScrollViewRef = useRef(null);
	const { currentUser } = useContext(AuthContext);
	const { socket } = useContext(SocketContext);
	const { showToast } = useToaster();

	useEffect(() => {
		if (socket && currentUser) {
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
			<MessageHeader selectedConversation={selectedConversation} setIsShowMessagesUI={setIsShowMessagesUI} />
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

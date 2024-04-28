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
import Message from "./Message";
import { checkIfUserOnMobile } from "../../helpers";

const Messages = ({ wrapperClassName, selectedConversation, setIsShowMessagesUI }) => {
	const [userInput, setuserInput] = useState("");
	const [messagesList, setMessagesList] = useState([]);
	const [isMessagesListLoading, setIsMessagesListLoading] = useState(true);
	const [isMessagesSending, setIsMessagesSending] = useState(false);
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
				setIsMessagesListLoading(true);
				let { data } = await getMessages({ convId: selectedConversation?.conversationId });
				setMessagesList(data);
			} catch (error) {
				showToast(error);
			} finally {
				setIsMessagesListLoading(false);
			}
		},
		[selectedConversation, messagesList]
	);

	useEffect(() => {
		if (selectedConversation) {
			fetchMessages(selectedConversation);
		}
	}, [selectedConversation]);

	const sendMessage = useCallback(async () => {
		try {
			setIsMessagesSending(true);
			let payload = {
				conversationId: selectedConversation?.conversationId,
				senderId: currentUser?._id,
				receiverId: selectedConversation?.user?.id,
				message: userInput,
			};
			socket.emit("sendMessage", payload);
			let { data } = await sendMessageApi(payload);
			setMessagesList((prevMessages) => [...prevMessages, data?.newMessage]);
			setuserInput("");
		} catch (error) {
			showToast(error);
		} finally {
			setIsMessagesSending(false);
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

	const getMessagesListUI = () => {
		if (isMessagesListLoading) {
			return Array(10)
				.fill("")
				.map((_, idx) => <Message key={idx} isAdmin={idx % 2 === 0} isMessagesListLoading={isMessagesListLoading} />);
		} else if (!!messagesList.length) {
			return messagesList.map((message) => (
				<Message
					message={message}
					key={message._id}
					isAdmin={message.senderId === currentUser._id}
					setIsMessagesListLoading={isMessagesListLoading}
				/>
			));
		} else
			return (
				<CustomTypography
					wrapperClassName="h-full flex items-center justify-center"
					label="Be the first to send the message"
					variant="h6"
				/>
			);
	};

	return (
		<div className={classNames("p-2 lg:p-6", wrapperClassName)}>
			<MessageHeader selectedConversation={selectedConversation} setIsShowMessagesUI={setIsShowMessagesUI} />
			{selectedConversation && (
				<>
					<div className="shadow-sm h-[calc(100vh-11rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-2 overflow-y-auto useScrollbar mb-6">
						{getMessagesListUI()}
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
							autoFocus={!checkIfUserOnMobile()}
						/>
						<IconButton
							disabled={isMessagesSending}
							type="submit"
							color="primary"
							className="!text-primaryDarkBg h-full"
							aria-label="send message"
						>
							<Send className="!text-3xl" />
						</IconButton>
					</form>
				</>
			)}
		</div>
	);
};

export default Messages;

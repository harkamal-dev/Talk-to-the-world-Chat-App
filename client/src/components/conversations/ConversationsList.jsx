import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { PersonAdd } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { AuthContext } from "contexts/authContext";
import { SocketContext } from "contexts/socketContext";
import useToaster from "hooks/useToaster";
import { getUsers } from "apis/login";
import { getConversations, createConversation } from "apis/conversation";
import { CustomTypography, UserAutocomplete, CustomButton } from "components";
import Conversation from "./Conversation";

const ConversationList = ({ wrapperClassName, setSelectedConversation, selectedConversation }) => {
	const [conversationList, setConversationList] = useState([]);
	const [isConversationListLoading, setIsConversationListLoading] = useState(true);
	const [isShowAddUserAutoComplete, setIsShowAddUserAutoComplete] = useState(false);
	const [selectedUserValue, setSelectedUserValue] = useState(null);
	const [users, setUsers] = useState([]);
	const formattedUsersList = useRef([]);
	const conversationListRef = useRef([]);
	const { currentUser } = useContext(AuthContext);
	const { showToast } = useToaster();
	const { socket } = useContext(SocketContext);

	useEffect(() => {
		if (socket && currentUser) {
			socket.on("getNewConversation", (conversation) => {
				console.log(conversation);
				setConversationList((prevConversation) => [...prevConversation, conversation]);
			});
			socket.on("getNewMessageInConversation", (conversation) => {
				console.log({ conversationListRef });
				let localConversationList = [...conversationListRef.current];
				let newConvIdx = localConversationList.findIndex((conv) => conv.conversationId === conversation.conversationId);
				localConversationList[newConvIdx] = {
					...localConversationList[newConvIdx],
					lastMessage: {
						message: conversation.lastMessage.message,
						senderId: conversation.lastMessage.senderId,
					},
				};
				debugger
				setConversationList(localConversationList);
				conversationListRef.current = localConversationList;
			});
		}
	}, [socket, currentUser]);

	console.log(conversationList);

	const fetchConversations = async () => {
		try {
			let { data } = await getConversations(currentUser?._id);
			setConversationList(data);
			conversationListRef.current = data;
		} catch (error) {
			console.log(error);
			showToast(error);
		} finally {
			setIsConversationListLoading(false);
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				let { data } = await getUsers();
				let customUsersData = data
					.filter((el) => el._id !== currentUser._id)
					.map((item) => ({
						label: `${item.fullName} (${item.email})`,
						id: item._id,
					}));
				formattedUsersList.current = customUsersData;
				setUsers(customUsersData);
			} catch (error) {
				console.log(error);
				showToast(error);
			}
		};

		if (currentUser) {
			fetchConversations();
			fetchUsers();
		}
	}, [currentUser]);

	const handleClickAddUser = () => {
		setIsShowAddUserAutoComplete(!isShowAddUserAutoComplete);
	};

	const handleCreateConversation = async () => {
		try {
			let senderId = currentUser._id;
			let receiverId = formattedUsersList.current.find((item) => item.label === selectedUserValue.label).id;
			let { data } = await createConversation({ senderId, receiverId });
			socket.emit("sendConversation", { ...data, userId: currentUser?._id });
			setSelectedConversation(data);
			fetchConversations();
		} catch (error) {
			console.log(error);
			showToast(error);
		}
	};

	const getConversationListUI = () => {
		if (isConversationListLoading) {
			return Array(5)
				.fill("")
				.map((item, index) => (
					<Conversation
						className="bg-primaryWhite first:rounded-t-2xl"
						key={index}
						isConversationListLoading={isConversationListLoading}
					/>
				));
		} else if (!!conversationList.length) {
			return conversationList?.map((conv) => (
				<Conversation
					className={classNames("bg-primaryWhite first:rounded-t-2xl", {
						"!bg-secondaryLightBg": selectedConversation?.conversationId === conv?.conversationId,
					})}
					key={conv.conversationId}
					convData={conv}
					setSelectedConversation={setSelectedConversation}
					isConversationListLoading={isConversationListLoading}
				/>
			));
		} else {
			return (
				<CustomTypography
					variant="body1"
					label="No conversations? You can start one by clicking above icon."
					wrapperClassName="p-4"
				/>
			);
		}
	};

	return (
		<div className={classNames("bg-primaryLightBg flex flex-col pt-4", wrapperClassName)}>
			<Conversation isAdmin />
			<div className="p-4 lg:p-8 pb-0">
				<div
					className={classNames("flex justify-between items-center", {
						"mb-4": isShowAddUserAutoComplete,
					})}
				>
					<CustomTypography label="Conversations" variant="h6" className="!text-left !mb-2 text-primaryDarkBg ubuntu-medium" />
					<IconButton onClick={handleClickAddUser} color="primary" aria-label="create new chat">
						<PersonAdd className="!text-3xl !text-textBlack cursor-pointer hover:!text-hoverBg" />
					</IconButton>
				</div>
				{isShowAddUserAutoComplete && (
					<div className="flex w-full gap-4">
						<div className="flex-1">
							<UserAutocomplete
								usersList={users}
								keyToSearch="fullName"
								value={selectedUserValue}
								setValue={setSelectedUserValue}
							/>
						</div>
						<CustomButton disabled={!selectedUserValue} label="CHAT" onClick={handleCreateConversation} size="small" />
					</div>
				)}
				<div
					className={classNames("rounded-2xl mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto noScrollbar", {
						"max-h-[calc(100vh-18rem)]": isShowAddUserAutoComplete,
						"shadow-xl": !!conversationList.length,
					})}
				>
					{getConversationListUI()}
				</div>
			</div>
		</div>
	);
};

export default ConversationList;

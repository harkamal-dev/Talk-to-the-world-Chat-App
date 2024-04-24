import React, { useState } from "react";
import ConversationList from "components/conversations/ConversationsList";
import Messages from "components/messages/Messages";
import classNames from "classnames";

const Dashboard = () => {
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [isShowMessagesUI, setIsShowMessagesUI] = useState(false);

	const handleConversationSelect = (conversation) => {
		setSelectedConversation(conversation);
		setIsShowMessagesUI(true);
	};

	return (
		<div className="h-screen w-full grid grid-cols-4">
			<ConversationList
				setSelectedConversation={handleConversationSelect}
				selectedConversation={selectedConversation}
				wrapperClassName={classNames("col-span-4 lg:col-span-1", {
					"hidden lg:block": isShowMessagesUI,
				})}
			/>
			<Messages
				wrapperClassName={classNames("col-span-4 lg:col-span-3", {
					"hidden lg:block": !isShowMessagesUI,
				})}
				selectedConversation={selectedConversation}
				setIsShowMessagesUI={setIsShowMessagesUI}
			/>
		</div>
	);
};

export default Dashboard;

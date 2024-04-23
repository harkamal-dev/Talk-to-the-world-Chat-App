import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/authContext";
import ConversationList from "components/ConversationsList";
import Messages from "components/Messages";
import { BASE_URL } from "../constants";

const Dashboard = () => {
	const { currentUser } = useContext(AuthContext);
	const [selectedConversation, setSelectedConversation] = useState(null);

	return (
		<div className="h-screen w-full grid grid-cols-4 ">
			<ConversationList
				setSelectedConversation={setSelectedConversation}
				selectedConversation={selectedConversation}
				wrapperClassName="col-span-1"
			/>
			<Messages wrapperClassName="col-span-3" selectedConversation={selectedConversation} />
		</div>
	);
};

export default Dashboard;

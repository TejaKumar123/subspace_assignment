import React, { useState } from "react";
import Navbar from "../components/chats/Navbar";
import ChatList from "../components/chats/ChatList";
import MessageBox from "../components/chats/MessageBox";

export default function Chats() {
    const [selectedChatId, setSelectedChatId] = useState(null);


    const handleSelectChat = (id) => {
        setSelectedChatId(id);
        // Load messages from Hasura for this chat
    };


    return (
        <div className="flex flex-col h-screen bg-gray-900 overflow-hidden ">
            <Navbar />
            <div className="flex flex-1 h-screen overflow-hidden">
                <ChatList
                    selectedChatId={selectedChatId}
                    onSelect={handleSelectChat}
                />
                <MessageBox
                    chatId={selectedChatId}
                />
            </div>
        </div>
    );
}

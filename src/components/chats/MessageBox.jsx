import { memo, useEffect, useRef, useState, useCallback } from "react";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions"
import { GET_CHAT_MESSAGES } from "../../graphql/queries"
import { INSERT_USER_MESSAGE, DELETE_MESSAGE } from "../../graphql/mutations"
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete } from "@mui/icons-material";

const MessageComponent = memo(({ msg }) => {
    console.log("rendering")
    const [deleteMessage] = useMutation(DELETE_MESSAGE);

    const handleDeleteMessage = async (id) => {
        try {
            await deleteMessage({ variables: { messageId: id } })
        }
        catch (err) {
            toast.error("error while deleting the message");
            //console.log(err);
        }
    }

    return (
        <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`relative max-w-md px-4 py-2 rounded-lg ${msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                    }`}
            >
                {msg.content}
                <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute top-[-20px] right-[-20px] text-[red] scale-[70%] text-xs bg-black p-[5px] rounded-[100%]"
                >
                    <Delete />
                </button>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return prevProps.msg.id == nextProps.msg.id &&
        prevProps.msg.content == nextProps.msg.content &&
        prevProps.msg.sender == nextProps.msg.sender;
})

export default function MessageBox({ chatId }) {
    const [content, setContent] = useState("");
    const messageref = useRef(null)

    const { data: initialData, loading: loadingMessages, error: errorMessages } = useQuery(
        GET_CHAT_MESSAGES,
        { variables: { chatId }, skip: !chatId }
    );

    // Live subscription
    const { data: subscriptionData } = useSubscription(MESSAGES_SUBSCRIPTION, {
        variables: { chatId },
        skip: !chatId,
    });

    const [insertMessage] = useMutation(INSERT_USER_MESSAGE);
    // const [deleteMessage] = useMutation(DELETE_MESSAGE);

    useEffect(() => {
        messageref.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatId])


    const handleSendMessage = async () => {
        try {
            if (content.trim() == "") {
                toast.error("Please the enter the message");
                return
            }
            await insertMessage({ variables: { chatId: chatId, content: content } })
            setContent("")
            messageref.current.scrollIntoView({ behavior: "smooth" })
        }
        catch (er) {
            toast.error("error while asking the bot, please try again or check internet connection");
            //console.log(er);
        }
    }

    const messages = subscriptionData?.messages || initialData?.messages || []
    if (!chatId) return <p className="p-4 text-white">Select a chat to start messaging.</p>;
    if (loadingMessages) return <p className="p-4  text-white">Loading messages...</p>;
    if (errorMessages) return <p className="p-4 text-red-500 ">Error loading messages.</p>;

    // console.log(subscriptionData)
    // console.log(initialData)



    // useEffect(() => {
    //     messageref.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages.length]);

    // const handleDeleteMessage = async (id) => {
    //     try {
    //         await deleteMessage({ variables: { messageId: id } })
    //     }
    //     catch (err) {
    //         toast.error("error while deleting the message");
    //         //console.log(err);
    //     }
    // }

    //todo: optimize the renders

    return (
        <div className="flex flex-col w-3/4 bg-gray-800 ">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-[20px] py-[20px] space-y-3 pb-[50px] pt-[20px]">
                {messages.map((msg) => (
                    <MessageComponent msg={msg} />
                ))}
                {messages.length == 0 && (
                    <p className="p-4 text-white">No Messages</p>
                )}
                <div ref={messageref} />
            </div>
            {/* Input */}
            <div className="flex items-center p-4 border-t border-gray-700  text-white">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

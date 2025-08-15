import { memo, useEffect, useRef, useState, useCallback } from "react";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions"
import { GET_CHAT_MESSAGES } from "../../graphql/queries"
import { INSERT_USER_MESSAGE, DELETE_MESSAGE, SEND_MESSAGE_ACTION } from "../../graphql/mutations"
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete } from "@mui/icons-material";

const MessageComponent = memo(({ msg }) => {
    //console.log("rendering")
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
            className={`w-[100%] mt-[7px] h-auto flex flex-row items-center ${msg.sender === "user" ? "justify-end" : "justify-start"} border-[0px]`}
        >
            <div
                className={`relative max-w-md px-4 py-2 group rounded-lg ${msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                    }`}
            >
                {msg.content}
                <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute top-[-20px] right-[-20px] group-hover:block hidden text-[red] scale-[70%] text-xs bg-black p-[5px] rounded-[100%]"
                >
                    <Delete />
                </button>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    //console.log("trying to react");
    return prevProps.msg.id == nextProps.msg.id &&
        prevProps.msg.content == nextProps.msg.content &&
        prevProps.msg.sender == nextProps.msg.sender;
})

export default function MessageBox({ chatId }) {
    const [content, setContent] = useState("");
    const messageref = useRef(null)
    const [messages, setMessages] = useState([]);

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
    const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
    // const [deleteMessage] = useMutation(DELETE_MESSAGE);

    // useEffect(() => {
    //     messageref.current?.scrollIntoView({ behavior: "smooth" });
    // }, [chatId])

    useEffect(() => {
        if (subscriptionData?.messages) {
            setMessages((prev) => {
                const newMsgs = subscriptionData.messages;
                // Only update if there is an actual change
                if (newMsgs.length !== prev.length) return newMsgs;
                for (let i = 0; i < newMsgs.length; i++) {
                    if (newMsgs[i].id !== prev[i].id || newMsgs[i].content !== prev[i].content) {
                        return newMsgs;
                    }
                }
                messageref.current?.scrollIntoView({ behavior: "smooth" });
                return prev;
            });
        }
    }, [subscriptionData]);

    useEffect(() => {
        if (initialData?.messages) {
            setMessages(initialData.messages);
        }
    }, [initialData]);

    const handleSendMessage = async () => {
        try {
            if (content.trim() == "") {
                toast.error("Please the enter the message");
                return
            }
            await insertMessage({ variables: { chatId: chatId, content: content } })
            let res = await sendMessageAction({ variables: { chatId: chatId, content: content } });
            console.log(res);
            setContent("")
            messageref.current?.scrollIntoView({ behavior: "smooth" })

        }
        catch (er) {
            toast.error("error while asking the bot, please try again or check internet connection");
            console.log(er);
        }
    }

    // const messages = subscriptionData?.messages || initialData?.messages || []
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
        <div className="flex flex-col w-3/4 bg-gray-800 relative h-full">
            {/* Messages */}
            <div className="w-full h-[full] overflow-y-auto border-[0px] mb-[80px]">
                <div className="h-auto px-[20px] mb-[80px] border-[red] border-[0px] pt-[20px]">
                    {messages.map((msg) => (
                        <MessageComponent msg={msg} />
                    ))}
                    {messages.length == 0 && (
                        <p className="p-4 text-white">No Messages</p>
                    )}
                    <br /><br />
                    <div ref={messageref} />
                </div>
            </div>
            {/* Input */}
            <div className="absolute w-[100%] bottom-0 flex items-center p-4 border-t border-gray-700  text-white bg-[#1F2937]">
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

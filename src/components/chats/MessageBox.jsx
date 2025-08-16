// import { memo, useEffect, useRef, useState, useCallback } from "react";
// import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions"
// import { GET_CHAT_MESSAGES } from "../../graphql/queries"
// import { INSERT_USER_MESSAGE, DELETE_MESSAGE, SEND_MESSAGE_ACTION } from "../../graphql/mutations"
// import { useQuery, useSubscription, useMutation } from "@apollo/client";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Delete } from "@mui/icons-material";

// import ReactMarkdown from "react-markdown";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import rehypeHighlight from "rehype-highlight";
// import "katex/dist/katex.min.css";

// const MessageComponent = memo(({ msg }) => {
//     //console.log("rendering")
//     const [deleteMessage] = useMutation(DELETE_MESSAGE);

//     const handleDeleteMessage = async (id) => {
//         try {
//             await deleteMessage({ variables: { messageId: id } })
//         }
//         catch (err) {
//             toast.error("error while deleting the message");
//             //console.log(err);
//         }
//     }

//     return (
//         // <div
//         //     key={msg.id}
//         //     className={`w-[100%] mt-[7px] h-auto flex flex-row items-center ${msg.sender === "user" ? "justify-end" : "justify-start"} border-[0px]`}
//         // >
//         //     <div
//         //         className={`relative max-w-md px-4 py-2 group rounded-lg ${msg.sender === "user"
//         //             ? "bg-blue-600 text-white"
//         //             : "bg-gray-700 text-gray-200"
//         //             }`}
//         //     >
//         //         {msg.content}
//         //         <button
//         //             onClick={() => handleDeleteMessage(msg.id)}
//         //             className="absolute top-[-20px] right-[-20px] group-hover:block hidden text-[red] scale-[70%] text-xs bg-black p-[5px] rounded-[100%]"
//         //         >
//         //             <Delete />
//         //         </button>
//         //     </div>
//         // </div>
//         <div
//             key={msg.id}
//             className={`w-[100%] mt-[7px] h-auto flex flex-row items-center ${msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//         >
//             <div
//                 className={`relative max-w-md px-4 py-2 group rounded-lg ${msg.sender === "user"
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-700 text-gray-200"
//                     }`}
//             >
//                 <ReactMarkdown
//                     remarkPlugins={[remarkMath]}
//                     rehypePlugins={[rehypeKatex, rehypeHighlight]}
//                     components={{
//                         code({ node, inline, className, children, ...props }) {
//                             return !inline ? (
//                                 <pre className="p-2 bg-black rounded-md overflow-x-auto">
//                                     <code className={className} {...props}>
//                                         {children}
//                                     </code>
//                                 </pre>
//                             ) : (
//                                 <code className="bg-gray-800 px-1 rounded" {...props}>
//                                     {children}
//                                 </code>
//                             );
//                         },
//                     }}
//                 >
//                     {msg.content}
//                 </ReactMarkdown>

//                 <button
//                     onClick={() => handleDeleteMessage(msg.id)}
//                     className="absolute top-[-20px] right-[-20px] group-hover:block hidden text-[red] scale-[70%] text-xs bg-black p-[5px] rounded-[100%]"
//                 >
//                     <Delete />
//                 </button>
//             </div>
//         </div>
//     )
// }, (prevProps, nextProps) => {
//     //console.log("trying to react");
//     return prevProps.msg.id == nextProps.msg.id &&
//         prevProps.msg.content == nextProps.msg.content &&
//         prevProps.msg.sender == nextProps.msg.sender;
// })

// export default function MessageBox({ chatId }) {
//     const [content, setContent] = useState("");
//     const messageref = useRef(null)
//     const [messages, setMessages] = useState([]);

//     const { data: initialData, loading: loadingMessages, error: errorMessages } = useQuery(
//         GET_CHAT_MESSAGES,
//         { variables: { chatId }, skip: !chatId }
//     );

//     // Live subscription
//     const { data: subscriptionData } = useSubscription(MESSAGES_SUBSCRIPTION, {
//         variables: { chatId },
//         skip: !chatId,
//     });

//     const [insertMessage] = useMutation(INSERT_USER_MESSAGE);
//     const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
//     // const [deleteMessage] = useMutation(DELETE_MESSAGE);

//     // useEffect(() => {
//     //     messageref.current?.scrollIntoView({ behavior: "smooth" });
//     // }, [chatId])

//     useEffect(() => {
//         if (subscriptionData?.messages) {
//             setMessages((prev) => {
//                 const newMsgs = subscriptionData.messages;
//                 // Only update if there is an actual change
//                 if (newMsgs.length !== prev.length) return newMsgs;
//                 for (let i = 0; i < newMsgs.length; i++) {
//                     if (newMsgs[i].id !== prev[i].id || newMsgs[i].content !== prev[i].content) {
//                         return newMsgs;
//                     }
//                 }
//                 messageref.current?.scrollIntoView({ behavior: "smooth" });
//                 return prev;
//             });
//         }
//     }, [subscriptionData]);

//     useEffect(() => {
//         if (initialData?.messages) {
//             setMessages(initialData.messages);
//         }
//     }, [initialData]);

//     const handleSendMessage = async () => {
//         try {
//             if (content.trim() == "") {
//                 toast.error("Please the enter the message");
//                 return
//             }
//             await insertMessage({ variables: { chatId: chatId, content: content } })
//             let lastMessages = messages.slice(-10).map((msg) => {
//                 return {
//                     role: msg.sender,
//                     content: msg.content
//                 }
//             })
//             lastMessages.push({ role: "user", content: content })
//             // alert(JSON.stringify(lastMessages));
//             let res = await sendMessageAction({ variables: { chatId: chatId, content: content, history: lastMessages } });
//             //console.log(res);
//             setContent("")
//             messageref.current?.scrollIntoView({ behavior: "smooth" })

//         }
//         catch (er) {
//             toast.error("error while asking the bot, please try again or check internet connection");
//             console.log(er);
//         }
//     }

//     // const messages = subscriptionData?.messages || initialData?.messages || []
//     if (!chatId) return <p className="p-4 text-white">Select a chat to start messaging.</p>;
//     if (loadingMessages) return <p className="p-4  text-white">Loading messages...</p>;
//     if (errorMessages) return <p className="p-4 text-red-500 ">Error loading messages.</p>;

//     // console.log(subscriptionData)
//     // console.log(initialData)



//     // useEffect(() => {
//     //     messageref.current?.scrollIntoView({ behavior: "smooth" });
//     // }, [messages.length]);

//     // const handleDeleteMessage = async (id) => {
//     //     try {
//     //         await deleteMessage({ variables: { messageId: id } })
//     //     }
//     //     catch (err) {
//     //         toast.error("error while deleting the message");
//     //         //console.log(err);
//     //     }
//     // }

//     //todo: optimize the renders

//     return (
//         <div className="flex flex-col w-3/4 bg-gray-800 relative h-full">
//             {/* Messages */}
//             <div className="w-full h-[full] overflow-y-auto border-[0px] mb-[80px]">
//                 <div className="h-auto px-[20px] mb-[80px] border-[red] border-[0px] pt-[20px]">
//                     {messages.map((msg) => (
//                         <MessageComponent msg={msg} />
//                     ))}
//                     {messages.length == 0 && (
//                         <p className="p-4 text-white">No Messages</p>
//                     )}
//                     <br /><br />
//                     <div ref={messageref} />
//                 </div>
//             </div>
//             {/* Input */}
//             <div className="absolute w-[100%] bottom-0 flex items-center p-4 border-t border-gray-700  text-white bg-[#1F2937]">
//                 <input
//                     type="text"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500"
//                 />
//                 <button
//                     onClick={handleSendMessage}
//                     className="ml-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }

import { memo, useEffect, useRef, useState, useCallback } from "react";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions"
import { GET_CHAT_MESSAGES } from "../../graphql/queries"
import { INSERT_USER_MESSAGE, DELETE_MESSAGE, SEND_MESSAGE_ACTION } from "../../graphql/mutations"
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ContentCopy,
    Check,
    Delete,
    Person,
    SmartToy,
    Send,
    Loop
} from "@mui/icons-material";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";

// Enhanced Code Block Component with Copy Functionality
const CodeBlock = memo(({ children, className, inline, ...props }) => {
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
            toast.error("Failed to copy code");
        }
    };

    const language = className?.replace('language-', '') || 'text';

    if (inline) {
        return (
            <code
                className="bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded text-sm font-mono border dark:border-slate-600/30"
                {...props}
            >
                {children}
            </code>
        );
    }

    return (
        <div
            className="relative group bg-slate-50 dark:bg-slate-900/50 rounded-lg border dark:border-slate-600/30 overflow-hidden my-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100/80 dark:bg-slate-800/60 border-b dark:border-slate-600/30">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {language}
                </span>
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-transparent hover:bg-slate-200/70 dark:hover:bg-slate-700/50 rounded transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-70'
                        }`}
                >
                    {copied ? (
                        <>
                            <Check className="text-green-500" style={{ fontSize: '12px' }} />
                            <span className="text-green-500">Copied</span>
                        </>
                    ) : (
                        <>
                            <ContentCopy style={{ fontSize: '12px' }} />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-slate-50/50 dark:bg-slate-900/30">
                <code
                    className={`font-mono text-slate-800 dark:text-slate-200 whitespace-pre ${className}`}
                    {...props}
                >
                    {children}
                </code>
            </pre>
        </div>
    );
});

const MessageComponent = memo(({ msg }) => {
    //console.log("rendering in component")
    const [deleteMessage] = useMutation(DELETE_MESSAGE);
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteMessage = async (id) => {
        setIsDeleting(true);
        try {
            await deleteMessage({ variables: { messageId: id } });
            toast.success("Message deleted successfully");
        } catch (err) {
            toast.error("Error while deleting the message");
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    }

    const isUser = msg.sender === "user";
    // const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            className="w-full py-3 px-4 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors duration-200 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-4xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                    {isUser ? <Person style={{ fontSize: '16px' }} /> : <SmartToy style={{ fontSize: '16px' }} />}
                </div>

                {/* Message Content */}
                <div className={` min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-full relative ${isUser
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md shadow-lg'
                        : 'bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-md border dark:border-slate-600/30 shadow-sm backdrop-blur-sm'
                        } px-4 py-3`}>
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                                components={{
                                    code: CodeBlock,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Timestamp */}
                    {/* <div className={`text-xs text-slate-500 dark:text-slate-400 mt-1.5 ${isUser ? 'text-right' : 'text-left'}`}>
                        {timestamp}
                    </div> */}
                </div>

                {/* Delete Action */}
                <div className={`flex-shrink-0 flex items-start transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        disabled={isDeleting}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 disabled:opacity-50 group/delete"
                        title="Delete message"
                    >
                        {isDeleting ? (
                            <Loop className="animate-spin" style={{ fontSize: '14px' }} />
                        ) : (
                            <Delete style={{ fontSize: '14px' }} className="group-hover/delete:scale-110 transition-transform" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    //console.log("rendering");
    return prevProps.msg.id === nextProps.msg.id &&
        prevProps.msg.content === nextProps.msg.content &&
        prevProps.msg.sender === nextProps.msg.sender;
});

export default function MessageBox({ chatId }) {
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messageref = useRef(null);
    const inputRef = useRef(null);
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

    useEffect(() => {
        if (subscriptionData?.messages) {
            setMessages((prev) => {
                const newMsgs = subscriptionData.messages;
                // Only update if there is an actual change
                if (newMsgs.length !== prev.length) {
                    // Show typing indicator for new assistant messages
                    if (newMsgs.length > prev.length && newMsgs[newMsgs.length - 1]?.sender === 'assistant') {
                        setIsTyping(false);
                    }
                    return newMsgs;
                }
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

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                messageref.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages.length]);

    // Focus input when chat changes
    useEffect(() => {
        if (chatId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    const handleSendMessage = async () => {
        if (content.trim() === "" || isSending) return;

        setIsSending(true);
        setIsTyping(true);

        try {
            await insertMessage({ variables: { chatId: chatId, content: content } });

            let lastMessages = messages.slice(-10).map((msg) => ({
                role: msg.sender,
                content: msg.content
            }));
            lastMessages.push({ role: "user", content: content });

            await sendMessageAction({
                variables: {
                    chatId: chatId,
                    content: content,
                    history: lastMessages
                }
            });

            setContent("");
            //toast.success("Message sent!");
        } catch (er) {
            toast.error("Error while asking the bot, please try again or check internet connection");
            console.error(er);
            setIsTyping(false);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!chatId) {
        return (
            <div className="flex flex-col items-center justify-center w-3/4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 h-full">
                <div className="text-center p-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border dark:border-slate-700/50 shadow-lg">
                    <SmartToy style={{ fontSize: '48px' }} className="mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                        Select a chat to start messaging
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                        Choose a conversation from the sidebar to begin
                    </p>
                </div>
            </div>
        );
    }

    if (loadingMessages) {
        return (
            <div className="flex flex-col items-center justify-center w-3/4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 h-full">
                <Loop className="animate-spin text-blue-500 mb-4" style={{ fontSize: '32px' }} />
                <p className="text-slate-600 dark:text-slate-400">Loading messages...</p>
            </div>
        );
    }

    if (errorMessages) {
        return (
            <div className="flex flex-col items-center justify-center w-3/4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 h-full">
                <div className="text-center p-8 rounded-2xl bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 shadow-lg">
                    <p className="text-red-600 dark:text-red-400 text-lg font-medium">Error loading messages</p>
                    <p className="text-red-500 dark:text-red-500 text-sm mt-2">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-3/4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative h-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                <div className="min-h-full pb-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <SmartToy style={{ fontSize: '64px' }} className="text-slate-300 dark:text-slate-600 mb-6" />
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Start a conversation
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 max-w-md">
                                Send your first message to begin chatting. I'm here to help with any questions you might have!
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <MessageComponent key={msg.id} msg={msg} />
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="w-full py-3 px-4">
                                    <div className="flex gap-3 max-w-5xl mr-auto">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                            <SmartToy style={{ fontSize: '16px' }} />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800/80 rounded-2xl rounded-tl-md border dark:border-slate-600/30 shadow-sm backdrop-blur-sm px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messageref} className="h-4" />
                </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                            rows={1}
                            className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100"
                            style={{
                                minHeight: '48px',
                                maxHeight: '120px',
                                height: 'auto'
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                        {content.trim() && (
                            <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                                {content.length}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!content.trim() || isSending}
                        className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
                        title={isSending ? "Sending..." : "Send message"}
                    >
                        {isSending ? (
                            <Loop className="animate-spin" style={{ fontSize: '20px' }} />
                        ) : (
                            <Send style={{ fontSize: '20px' }} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
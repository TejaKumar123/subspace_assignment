import { useState } from "react";
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { GET_USER_CHATS } from '../../graphql/queries';
import { CHATS_SUBSCRIPTION } from '../../graphql/subscriptions';
import { CREATE_CHAT, DELETE_CHAT } from "../../graphql/mutations/"
import nhost from "../../utils/nhostClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_CHAT } from "../../graphql/mutations";
import { Cancel, Edit } from "@mui/icons-material"

export default function ChatList({ selectedChatId, onSelect }) {
    const [menuOpenId, setMenuOpenId] = useState(null);
    const user = nhost.auth.getUser();
    const [chatname, setChatname] = useState("")

    const [editing, setEditing] = useState(false)
    const [rename, setRename] = useState("")
    const [editingId, setEditingId] = useState(null);

    const {
        data: queryData,
        loading: queryLoading,
        error: queryError,
    } = useQuery(GET_USER_CHATS, {
        skip: !user,
    });

    // Real-time subscription
    const {
        data: subData,
        loading: subLoading,
        error: subError,
    } = useSubscription(CHATS_SUBSCRIPTION, {
        skip: !user,
    });

    const [createChatMutation, { loading: creating }] = useMutation(CREATE_CHAT);
    const [deleteChatMutation, { loading: deleting }] = useMutation(DELETE_CHAT);
    const [updateChatMutation, { loading: updating }] = useMutation(UPDATE_CHAT);



    const handleChatAdd = async () => {
        try {

            if (chatname.trim() == "") {
                toast.error("Chat name required");
                return
            }
            let name = chatname
            let res = await createChatMutation({ variables: { name: name.trim() } });
            //console.log(res)
            toast.success(`${res?.data?.insert_chats_one?.name} chat added`)
            setChatname("")
            onSelect(res?.data?.insert_chats_one?.id)
        }
        catch (er) {
            toast.error("error occured while creating chat. please check internet connetion.")
            //console.log(er)
        }
    }

    const handleEditChat = async (id) => {
        try {
            if (rename.trim() == "") {
                toast.error("chatname is required");
                return
            }
            let res = await updateChatMutation({ variables: { chatId: id, newName: rename.trim() } })
            toast.success("chat name renamed")
            setRename("")
            setEditingId("")
            setEditing(false);
        }
        catch (er) {
            toast.error("error while renaming.")
            //console.log(er)
        }
    };

    const handleDeleteChat = async (id) => {
        try {
            let res = await deleteChatMutation({ variables: { chatId: id } });
            if (id == selectedChatId) {
                onSelect("")
            }
            toast.success("chat deleted successfully");
        }
        catch (er) {
            toast.error("error while deleting please check the internet connetion");
            //console.log(er)
        }
    };

    if (!user) return <p className="text-gray-500">Please sign in to view chats.</p>;
    // if (queryLoading || subLoading) return <p className="text-blue-500">Loading chats...</p>;
    if (queryError || subError)
        return <p className="text-red-500">Error: {queryError?.message || subError?.message}</p>;

    // Prefer subscription data if available
    const chats = subData?.chats || queryData?.chats || [];

    return (
        <div className="w-1/4 flex flex-col items-center justify-start p-[10px]">
            <input
                type="text"
                placeholder="Enter chat name"
                value={chatname} onChange={(e) => { setChatname(e.currentTarget.value) }}
                className="w-full text-white px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {creating ?
                <button className="w-[100%] text-[black] opacity-40 bg-[white] px-[20px] py-[5px] rounded-[5px] mt-[10px] mb-[10px]">creating....</button>
                :
                <button
                    onClick={handleChatAdd}
                    className="w-[100%] text-[black] bg-[white] px-[20px] py-[5px] rounded-[5px] mt-[10px] mb-[10px]">New Chat</button>
            }

            {queryLoading || subLoading ? <p className="text-blue-500">Loading chats...</p>
                :
                <div className="w-[100%] border-grey-700 bg-gray-900 text-white overflow-y-auto">
                    {chats.map((chat) => {
                        return (<div
                            key={chat.id}
                            className={`group flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-800 ${selectedChatId === chat.id ? "bg-gray-800" : ""
                                }`}
                            onClick={() => onSelect(chat.id)}
                        >

                            {editing == true && chat.id == editingId && (
                                <div className="w-[100%] flex flex-row items-center justify-between gap-x-[4px]">
                                    <input
                                        type="text"
                                        placeholder={rename}
                                        value={rename}
                                        className="w-[80%] text-white px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                        onChange={(e) => setRename(e.currentTarget.value)}
                                    />
                                    <button
                                        onClick={() => {
                                            handleEditChat(chat.id)
                                        }}
                                        className="hover:bg-[rgba(0,0,0,0.3)] rounded-[100%] p-[7px]"

                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRename("")
                                            setEditingId("")
                                            setEditing(false)
                                        }}
                                        className="hover:bg-[rgba(0,0,0,0.3)] rounded-[100%] p-[7px]"
                                    >
                                        <Cancel />
                                    </button>
                                </div>
                            )}

                            {chat.id != editingId &&
                                <span>{chat.name}</span>
                            }

                            {chat.id != editingId &&
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
                                        }}
                                        className="px-[13px] py-[3px] text-[100%] rounded-[100%] hover:bg-gray-700"
                                    >
                                        ⋮
                                    </button>
                                    {menuOpenId === chat.id && chat.id != editingId && (
                                        <div className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditing(true)
                                                    setRename(chat.name)
                                                    setEditingId(chat.id)
                                                    setMenuOpenId(null);

                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                                            >
                                                Rename
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteChat(chat.id);
                                                    setMenuOpenId(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                        )
                    })}
                </div>
            }
        </div >
    );
}

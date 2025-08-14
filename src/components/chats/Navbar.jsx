import React, { useState } from "react";
import { useUserData, useSignOut } from "@nhost/react";

export default function Navbar() {
    const user = useUserData();
    const { signOut } = useSignOut();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white border-b border-gray-700 z-[5]">
            <h1 className="text-xl font-bold">🤖 ChatBot App</h1>

            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.displayName?.[0] || user?.email?.[0] || "U"}
                    </div>
                    <span>{user?.displayName || user?.email}</span>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                        <div className="px-4 py-2 text-sm text-gray-300">{user?.email}</div>
                        <button
                            onClick={signOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

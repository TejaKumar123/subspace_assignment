import { useState } from "react";
import { useSignInEmailPassword, useUserData } from "@nhost/react";
import { useNavigate, Link } from "react-router-dom";
import nhost from "../utils/nhostClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
    const navigate = useNavigate();
    const { signInEmailPassword, isLoading, isSuccess, isError, error } =
        useSignInEmailPassword();
    const user = useUserData();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async (e) => {
        try {

            e.preventDefault();
            const res = await signInEmailPassword(email, password);
            //await nhost.auth.refreshSession();
            // console.log(user);
            // console.log("error")
            // console.log(res)
            if (res?.needsEmailVerification) {
                toast.error("please verify you email. Check you inbox or spam email.")
                return
            }
            //console.log(res);
        }
        catch (er) {
            toast.error("Error while login");
            //console.log(er);
        }
    };

    if (isSuccess) {
        // console.log(user);
        // console.log(isSuccess);
        toast.success("successfully login");
        navigate("/chats"); // Redirect after login
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error */}
                    {isError && (
                        <p className="text-red-500 text-sm">
                            {error?.message || "Failed to sign in"}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Sign Up Redirect */}
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

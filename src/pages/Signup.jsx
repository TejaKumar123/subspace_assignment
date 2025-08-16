import React, { useState } from "react";
import { useSignInEmailPassword, useSignUpEmailPassword, useUserData } from "@nhost/react";
import { useNavigate, Link } from "react-router-dom";
import nhost from "../utils/nhostClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
    const navigate = useNavigate();
    const { signUpEmailPassword, isLoading, isSuccess, isError, error } =
        useSignUpEmailPassword();
    const { signInEmailPassword } =
        useSignInEmailPassword();
    const user = useUserData();
    const [emailSent, setEmailSent] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e) => {
        try {

            e.preventDefault();
            let res = await signUpEmailPassword(email, password);
            // console.log(user);
            // console.log("result");
            // console.log(res);
            if (res?.needsEmailVerification) {
                setEmailSent(true);
            }
        }
        catch (er) {
            toast.error("error occured.")
            console.log(er);
        }
    };

    const handleVerifyEmail = async () => {
        try {
            let res = await signInEmailPassword(email, password);
            if (res?.needsEmailVerification) {
                toast.error("Email not verified")
            }
        }
        catch (er) {
            toast.error("error while verifying");
            //console.log(er);
        }
    }

    if (isSuccess) {
        console.log(user);
        console.log(isSuccess);
        navigate("/chats"); // Redirect after successful signup
    }

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
                    <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
                    <div className="flex w-auto h-auto px-[10px] py-[5px] flex-col items-center justify-start bg-[rgba(255,255,255,1)] border-[rgba(255,255,255,0.5)] border-[1px] rounded-[7px]">
                        <p className="text-center text-[100%] text-[green]">Email sent Successfully</p>
                        <p className="text-center text-[90%] text-[black]">Please check your spam emails also</p>
                        <p className="text-center text-[90%] text-[black]">Click the following button after verifying your email.</p>
                    </div>
                    <br />
                    <button
                        className="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50"
                        onClick={handleVerifyEmail}
                    >
                        Yes, Email Verified
                    </button>


                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSignUp} className="space-y-4">
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
                            {error?.message || "Failed to sign up"}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50"
                    >
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                {/* Sign In Redirect */}
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

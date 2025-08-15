import { Link } from 'react-router-dom';
import { useAuthenticationStatus } from "@nhost/react";


const Home = () => {
    const { isAuthenticated, isLoading } = useAuthenticationStatus();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <header className="flex justify-between items-center p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold tracking-wide">🤖 ChatBot App</h1>
                {!isAuthenticated &&
                    <div className="space-x-4">
                        <Link
                            to="/signin"
                            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                        >
                            Sign Up
                        </Link>
                    </div>
                }
            </header>

            {/* Main Section */}
            <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl font-bold mb-4">Welcome to the ChatBot App</h2>
                <p className="text-lg text-gray-300 max-w-2xl mb-8">
                    A real-time chatbot experience powered by Nhost, Hasura GraphQL,
                    n8n, and OpenRouter. Sign in to start chatting with our AI-powered assistant.
                </p>
                <Link
                    to="/chats"
                    className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 text-lg font-semibold"
                >
                    🚀 Start Chatting
                </Link>
            </main>

            {/* Features */}
            <section className="bg-gray-900 py-12 px-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Features</h3>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        {
                            title: "🔐 Secure Auth",
                            desc: "Email-based sign in & sign up with Nhost Auth, protected with permissions.",
                        },
                        {
                            title: "💬 Real-Time Chat",
                            desc: "GraphQL subscriptions keep your messages instantly updated.",
                        },
                        {
                            title: "⚡ AI Responses",
                            desc: "Chatbot powered by n8n workflows and OpenRouter API.",
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition"
                        >
                            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                            <p className="text-gray-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="p-6 text-center border-t border-gray-700 text-gray-500">
                © {new Date().getFullYear()} ChatBot App. Built for Internship Assessment.
            </footer>
        </div>
    );
}

export default Home;
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx";
import Signin from './pages/Signin';
import Signup from "./pages/Signup";
import Chats from "./pages/Chats";
import { ToastContainer, toast } from 'react-toastify';
import { useAuthenticationStatus } from "@nhost/react";
import Loading from './components/others/AuthLoading.';

const App = () => {
	const { isAuthenticated, isLoading } = useAuthenticationStatus();

	if (isLoading) {
		return <Loading />
	}

	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signin' element={!isAuthenticated ? <Signin /> : <Navigate to={"/chats"} />} />
				<Route path='/signup' element={!isAuthenticated ? <Signup /> : <Navigate to={"/chats"} />} />
				<Route path='/chats' element={isAuthenticated ? <Chats /> : <Navigate to={"/signin"} />} />
			</Routes>
			<ToastContainer theme='dark' />
		</>
	)
}

export default App
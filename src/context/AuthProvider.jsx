import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../appwrite/api";

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		id: "",
		name: "",
		email: "",
		imageURL: "",
		bio: "",
	});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const checkAuthUser = async () => {
		setIsLoading(true);
		try {
			const currentAccount = await getCurrentUser();
			if (currentAccount) {
				setUser({
					id: currentAccount.$id,
					name: currentAccount.name,
					email: currentAccount.email,
					imageURL: currentAccount.imageURL,
					bio: currentAccount.bio,
				});
				setIsAuthenticated(true);
				return true;
			}

			return false;
		} catch (error) {
			console.error("Error checking auth user: ", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const cookieFallback = localStorage.getItem("cookieFallback");
		if (
			cookieFallback === "[]" ||
			cookieFallback === null ||
			cookieFallback === undefined
		) {
			navigate("/sign-in");
		}

		checkAuthUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isLoading,
				isAuthenticated,
				setIsAuthenticated,
				checkAuthUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

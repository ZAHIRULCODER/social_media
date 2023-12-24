import { useEffect, useState, ReactNode } from "react";
import AuthContext, { INITIAL_USER } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../appwrite/api/api";
import { IUser } from "../types/types";

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<IUser>(INITIAL_USER);
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
			navigate("/auth/sign-in");
		}

		checkAuthUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				setUser,
				setIsAuthenticated,
				checkAuthUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

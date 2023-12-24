import { createContext } from "react";
import { IAuthContextProps, IUser } from "../types/types";

export const INITIAL_USER: IUser = {
	id: "",
	name: "",
	email: "",
	imageURL: "",
	bio: "",
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isLoading: false,
	isAuthenticated: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IAuthContextProps>(INITIAL_STATE);

export default AuthContext;

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);

	return <div>{isAuthenticated ? <Navigate to="/home" /> : <Outlet />}</div>;
};

export default AuthLayout;

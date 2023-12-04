import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Skeleton } from "antd";

const AuthLayout = () => {
	const { isAuthenticated, isLoading } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		(() => {
			if (!isLoading && !isAuthenticated) {
				navigate("/sign-in");
			}
		})();
	}, [isLoading, isAuthenticated]);

	return isLoading ? <Skeleton /> : <Outlet />;
};

export default AuthLayout;

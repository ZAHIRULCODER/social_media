import React, { useContext } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useSignOutAccount } from "../tanstack-query/Queries";

const SideBar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
	const { mutate: signOutAccount } = useSignOutAccount();

	const handleSignOut = () => {
		signOutAccount();
		setUser(null);
		setIsAuthenticated(false);
		navigate("/sign-in");
	};

	return (
		<div>
			<Menu
				style={{ width: 200, position: "fixed", height: "100vh" }}
				defaultSelectedKeys={[pathname]}
				onClick={({ key }) => {
					if (key === "sign-out") {
						handleSignOut();
					} else {
						navigate(key);
					}
				}}
				items={[
					{ label: "Home", key: "/" },
					{ label: "Explore", key: "/explore" },
					{ label: "All Users", key: "/all-users" },
					{ label: "Saved", key: "/saved" },
					{ label: "Profile", key: `/profile/${user.id}` },
					{ label: "Create Post", key: "/create-post" },
					{ label: "Signout", key: "sign-out", danger: true },
				]}></Menu>
		</div>
	);
};

export default SideBar;

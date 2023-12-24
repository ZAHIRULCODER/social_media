import { createElement, useContext } from "react";
import type { MenuProps } from "antd";
import { Avatar, Layout, Menu } from "antd";
import {
	HomeOutlined,
	CompassOutlined,
	UsergroupAddOutlined,
	HeartOutlined,
	IdcardOutlined,
	FormOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;
import { useNavigate } from "react-router-dom";
import { useSignOutAccount } from "../tanstack-query/Queries";
import AuthContext, { INITIAL_USER } from "../context/AuthContext";

const SideBar = () => {
	const navigate = useNavigate();
	const { user, setUser, setIsAuthenticated } = useContext(AuthContext);

	//Query
	const { mutate: signOutAccount } = useSignOutAccount();

	const items: MenuProps["items"] = [
		{
			key: "/home",
			icon: createElement(HomeOutlined),
			label: "Home",
		},
		{
			key: "/explore",
			icon: createElement(CompassOutlined),
			label: "Explore",
		},
		{
			key: "/all-user",
			icon: createElement(UsergroupAddOutlined),
			label: "All Users",
		},
		{
			key: "/saved-post",
			icon: createElement(HeartOutlined),
			label: "Saved Post",
		},
		{
			key: `/profile/${user.id}`,
			icon: createElement(IdcardOutlined),
			label: "Profile",
		},
		{
			key: "/create-post",
			icon: createElement(FormOutlined),
			label: "Create Post",
		},
		{
			key: "sign-out",
			icon: createElement(LogoutOutlined),
			label: "Sign Out",
			danger: true,
		},
	];

	const handleSignOut = async () => {
		signOutAccount();
		setUser(INITIAL_USER);
		setIsAuthenticated(false);
		navigate("/auth/sign-in");
	};

	return (
		<Layout hasSider>
			<Sider
				style={{
					overflow: "auto",
					height: "100vh",
					position: "fixed",
					left: 0,
					top: 0,
					bottom: 0,
				}}>
				<div
					style={{
						backgroundColor: "orange",
						padding: 7,
						margin: 5,
						borderRadius: 7,
						fontWeight: "bold",
						fontSize: 15,
					}}>
					<Avatar src={user?.imageURL} size={50} style={{ marginRight: 10 }} />
					<span style={{ textTransform: "uppercase" }}>{user?.name}</span>
				</div>
				<Menu
					onClick={({ key }) => {
						if (key === "sign-out") {
							handleSignOut();
						} else {
							navigate(key);
						}
					}}
					theme="dark"
					mode="inline"
					defaultSelectedKeys={["4"]}
					items={items}
				/>
			</Sider>
		</Layout>
	);
};

export default SideBar;

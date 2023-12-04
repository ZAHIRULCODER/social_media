import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flex: 1,
				height: "100vh",
			}}>
			<NavBar />

			<section style={{ display: "flex", flexDirection: "row", flex: 1 }}>
				<SideBar />
				<Outlet />
			</section>
		</div>
	);
};

export default RootLayout;

import React from "react";

const NavBar = () => {
	return (
		<section style={{position: "sticky", top:0, zIndex: 10}}>
			<div
				style={{
					height: 60,
					backgroundColor: "black",
					color: "white",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				Navbar
			</div>
		</section>
	);
};

export default NavBar;

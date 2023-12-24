import Footer from "../components/FooterBar";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	return (
		<main>
			<NavBar />
			<section>
				<SideBar />
				<Outlet />
			</section>
			<Footer />
		</main>
	);
};

export default RootLayout;

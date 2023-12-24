import { Layout } from "antd";
const { Footer } = Layout;

const FooterBar = () => {
	return (
		<Layout style={{ marginLeft: 200 }}>
			<Footer
				style={{
					textAlign: "center",
					bottom: 0,
				}}>
				Social Media App ©2023 Created Sk Zahirul Islam
			</Footer>
		</Layout>
	);
};

export default FooterBar;

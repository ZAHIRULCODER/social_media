import PostForm from "../../components/post-form/PostForm";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const CreatePostPage = () => {
	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				{/* Title: Home Feed */}
				<Title level={2}>Create Post</Title>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					<PostForm action="Create" />
				</div>
			</Content>
		</Layout>
	);
};

export default CreatePostPage;

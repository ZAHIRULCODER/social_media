import { useParams } from "react-router-dom";
import { useGetPostById } from "../../tanstack-query/Queries";
import { Skeleton } from "antd";
import PostForm from "../../components/post-form/PostForm";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const UpdatePostPage = () => {
	const { id } = useParams();
	const { data: post, isLoading: isGettingPostToUpdate } = useGetPostById(
		id || ""
	);

	if (isGettingPostToUpdate) return <Skeleton />;

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				{/* Title: Home Feed */}
				<Title level={2}>Update Post</Title>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					{isGettingPostToUpdate ? (
						<Skeleton />
					) : (
						<PostForm post={post} action="Update" />
					)}
				</div>
			</Content>
		</Layout>
	);
};

export default UpdatePostPage;

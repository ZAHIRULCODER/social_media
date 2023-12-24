import { Models } from "appwrite";
import { Typography, Layout, Skeleton } from "antd";
import {
	useGetCurrentUser,
	useGetRecentPosts,
} from "../../tanstack-query/Queries";
import GridPostList from "../../components/GridPostList";

const { Title, Text } = Typography;
const { Content } = Layout;

const SavedPage = () => {
	const { data: currentUser } = useGetCurrentUser();
	const { data: posts } = useGetRecentPosts();

	const savedPost = currentUser?.save
		.map((savePost: Models.Document) => {
			// Find the corresponding post in posts.documents
			const correspondingPost = posts?.documents.find(
				(post) => post.id === savePost?.post?.id
			);
			return {
				...savePost?.post,
				creator: {
					imageURL: currentUser?.imageURL,
				},
				likes: correspondingPost?.likes || [],
			};
		})
		.reverse();

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				<Title level={2}>Saved Post</Title>
				{!currentUser ? (
					<Skeleton active />
				) : savedPost?.length === 0 ? (
					<Text>You have no saved post</Text>
				) : (
					<GridPostList posts={savedPost} />
				)}
			</Content>
		</Layout>
	);
};

export default SavedPage;

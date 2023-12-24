import PostCard from "../../components/PostCard";
import { Layout, Skeleton } from "antd";
import { useGetRecentPosts } from "../../tanstack-query/Queries";

const { Content } = Layout;

const HomePage = () => {
	//Queries
	const { data: posts, isLoading: isPostLoading } = useGetRecentPosts();

	return (
		<Layout style={{ marginLeft: 200 }}>
			{/* Main Content cards */}
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					{isPostLoading && !posts ? (
						<Skeleton active />
					) : (
						<>
							{posts?.documents.map((post) => (
								<PostCard key={post.$id} post={post} />
							))}
						</>
					)}
				</div>
			</Content>
		</Layout>
	);
};

export default HomePage;

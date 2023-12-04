import React from "react";
import PostCard from "../../components/PostCard";
import { useGetRecentPosts } from "../../tanstack-query/Queries";
import { Skeleton } from "antd";

const Home = () => {
	const {
		data: posts,
		isPending: isPostLoading,
		isError: isErrorPosts,
	} = useGetRecentPosts();

	return (
		<div
			style={{
				width: "100%",
				padding: 40,
			}}>
			<h1 style={{ textAlign: "center", paddingBottom: 30 }}>Home Feed</h1>
			{isPostLoading && !posts ? (
				<Skeleton active />
			) : (
				<ul>
					{posts?.documents?.map((post) => (
						<li
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								paddingBottom: 30,
								listStyleType: "none",
							}}
							key={post.$id}>
							<PostCard post={post} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Home;

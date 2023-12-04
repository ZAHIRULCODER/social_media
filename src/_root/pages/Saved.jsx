import React from "react";
import { useGetCurrentUser } from "../../tanstack-query/Queries";
import { Skeleton } from "antd";
import GridPostList from "../../components/GridPostList";

const Saved = () => {
	const { data: currentUser } = useGetCurrentUser();

	const savePosts = currentUser?.save
		.map((savePost) => ({
			...savePost?.post,
			creator: {
				imageURL: currentUser?.imageURL,
			},
		}))
		.reverse();

	return (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<div style={{ width: "70%", marginTop: 30 }}>
				<h1>Saved Post</h1>
				<div style={{ marginTop: 20 }}>
					{!currentUser ? (
						<Skeleton active />
					) : (
						<ul>
							{savePosts.length === 0 ? (
								<p>No available posts</p>
							) : (
								<GridPostList posts={savePosts} />
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Saved;

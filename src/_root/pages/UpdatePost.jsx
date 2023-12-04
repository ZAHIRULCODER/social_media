import React from "react";
import { Typography, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useGetPostById } from "../../tanstack-query/Queries";
import PostForm from "../../components/post-form/PostForm";

const { Title } = Typography;

const UpdatePost = () => {
	const { id } = useParams();

	const { data: post, isPending: gettingPost } = useGetPostById(id);

	if (gettingPost) return <Skeleton active />;

	return (
		<div
			style={{
				width: "100%",
				padding: 40,
				paddingLeft: 150,
				paddingRight: 150,
			}}>
			<Title level={2} style={{ textAlign: "start" }}>
				Update Post
			</Title>

			<PostForm post={post} action="Update" />
		</div>
	);
};

export default UpdatePost;

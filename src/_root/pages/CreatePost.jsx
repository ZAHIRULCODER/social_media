import React from "react";
import { Typography } from "antd";
import PostForm from "../../components/post-form/PostForm";

const { Title } = Typography;

const CreatePost = () => {
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
			}}>
			<div style={{ width: "70%", marginTop: 30, marginBottom: 10 }}>
				<Title level={2} style={{ textAlign: "start" }}>
					Create Post
				</Title>

				<PostForm action="Create" />
			</div>
		</div>
	);
};

export default CreatePost;

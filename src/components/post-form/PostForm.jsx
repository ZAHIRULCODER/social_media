import React, { useContext } from "react";
import UploadFile from "../UploadFile";
import { Button, Form, Input, Typography } from "antd";
import AuthContext from "../../context/AuthContext";
import { useCreatePost, useUpdatePost } from "../../tanstack-query/Queries";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const PostForm = ({ post, action }) => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { mutateAsync: createPost, isPending: isCreatingPost } =
		useCreatePost();

	const { mutateAsync: updatePost, isPending: isUpdatingPost } =
		useUpdatePost();

	const { user } = useContext(AuthContext);

	//Create post
	const handleSubmit = async (values) => {
		if (post && action === "Update") {
			console.log(values);
			const updatedPost = await updatePost({
				...values,
				postID: post.$id,
				imageID: post?.imageID,
				imageURL: post?.imageURL,
			});

			if (!updatedPost) toast.error("Please try again.");

			return navigate(`/post-details/${post.$id}`);
		}
		const newPost = await createPost({
			...values,
			userID: user.id,
		});

		if (!newPost) toast.error("Please try again.");

		navigate("/");
	};

	return (
		<Form
			initialValues={{
				caption: post ? post?.caption : "",
				location: post ? post?.location : "",
				file: [],
				tags: post ? post?.tags.join(", ") : "",
			}}
			form={form}
			onFinish={handleSubmit}>
			<Title level={4} style={{ textAlign: "start" }}>
				Caption
			</Title>
			<Form.Item
				name="caption"
				rules={[{ required: true, message: "Please input your caption!" }]}>
				<Input.TextArea rows={6} />
			</Form.Item>

			<Title level={4} style={{ textAlign: "start" }}>
				Add Photos
			</Title>

			<Form.Item name="file">
				<UploadFile
					fieldChange={(file) => form.setFieldsValue({ file })}
					mediaURL={post?.imageURL}
				/>
			</Form.Item>

			<Title level={4} style={{ textAlign: "start" }}>
				Add Location
			</Title>
			<Form.Item name="location">
				<Input style={{ padding: 10 }} placeholder="Enter your Location" />
			</Form.Item>

			<Title level={4} style={{ textAlign: "start" }}>
				Add Tags (separated by coma " , ")
			</Title>
			<Form.Item
				name="tags"
				rules={[
					{
						required: true,
						message: "Please enter tags separated by a comma",
						pattern: /^(\w+(, \w+)*)?$/,
					},
				]}>
				<Input
					style={{ padding: 10 }}
					placeholder="Learning, Coding, Playing"
				/>
			</Form.Item>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "end",
					gap: 15,
				}}>
				<Button size="large" htmlType="submit" type="primary" danger>
					Cancel
				</Button>
				<Button
					size="large"
					disabled={isCreatingPost || isUpdatingPost}
					loading={isCreatingPost || isUpdatingPost}
					htmlType="submit"
					type="primary">
					{action} Post
				</Button>
			</div>
		</Form>
	);
};

export default PostForm;

import { Form, Input, Button, Space, message, Select, Card } from "antd";
import CustomFileUploader from "../CustomFileUploader";
import { useNavigate } from "react-router-dom";
import { useCreatePost, useUpdatePost } from "../../tanstack-query/Queries";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Models } from "appwrite";
import { RcFile } from "antd/es/upload";

const { TextArea } = Input;

type PostFormProps = {
	post?: Models.Document;
	action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	//Queries
	const { mutateAsync: createPost, isPending: isCreatingPost } =
		useCreatePost();
	const { mutateAsync: updatePost, isPending: isUpdatingPost } =
		useUpdatePost();

	const handleSubmitPost = async (values: {
		caption: string;
		tags: string;
		postImage: RcFile[];
		location: string;
	}) => {
		const { caption, tags, postImage, location } = values;

		// ACTION = UPDATE
		if (post && action === "Update") {
			const updatedPost = await updatePost({
				caption,
				tags,
				location,
				file: postImage,
				postID: post?.$id,
				imageID: post?.imageID,
				imageURL: post?.imageURL,
			});

			if (!updatedPost) {
				message.error(`${action} post failed. Please try again.`);
				return;
			}
			message.success(`${action} post successful.`);
			return navigate(`/home`);
		}

		// Ensure that at least one image is selected
		if (!values?.postImage || values?.postImage?.length === 0) {
			message.error("Please select at least one image.");
			return;
		}

		const newPost = await createPost({
			caption,
			tags,
			location,
			file: postImage,
			userID: user?.id,
		});

		if (!newPost) {
			message.error(`${action} post failed. Please try again.`);
			return;
		}

		message.success(`${action} post successful.`);
		navigate("/home");
	};

	const onCancel = () => {
		form.resetFields();
	};

	return (
		<Card style={{ width: 800 }}>
			<Form
				form={form}
				onFinish={handleSubmitPost}
				initialValues={{
					caption: post?.caption,
					location: post?.location,
					tags: post?.tags,
					file: [],
				}}
				layout="vertical"
				labelCol={{ span: 4 }}>
				<Form.Item
					label="Caption"
					name="caption"
					rules={[{ message: "Please enter a caption" }]}>
					<TextArea rows={6} />
				</Form.Item>

				<Form.Item label="Add Photos" name="postImage">
					<CustomFileUploader
						form={form}
						fieldName="postImage"
						imageURL={post?.imageURL}
					/>
				</Form.Item>

				<Form.Item label="Add Location" name="location">
					<Input placeholder="Enter location" />
				</Form.Item>

				<Form.Item label="Add Tags" name="tags">
					<Select
						mode="tags"
						style={{ width: "100%" }}
						placeholder="Add tags"
						tokenSeparators={[","]}
					/>
				</Form.Item>

				<Form.Item>
					<Space>
						<Button onClick={onCancel}>Cancel</Button>
						<Button
							disabled={isCreatingPost || isUpdatingPost}
							loading={isCreatingPost || isUpdatingPost}
							type="primary"
							htmlType="submit">
							{action} Post
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default PostForm;

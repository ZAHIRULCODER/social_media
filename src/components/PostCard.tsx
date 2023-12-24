import {
	Card,
	Avatar,
	Space,
	Button,
	Typography,
	Tag,
	List,
	Input,
	Divider,
	Tooltip,
	Row,
	Col,
	Image,
	Form,
} from "antd";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import PostStats from "./PostStats";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
	useCreateComment,
	useDeleteComment,
	useGetCommentsByPostId,
	useUpdateComment,
} from "../tanstack-query/Queries";

const { Paragraph, Text } = Typography;

type PostCardProps = {
	post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
	const [form] = Form.useForm();
	const { user } = useContext(AuthContext);
	const [updatingCommentId, setUpdatingCommentId] = useState("");

	//Queries
	const { mutate: createComment } = useCreateComment();
	const { mutateAsync: deleteComment } = useDeleteComment();
	const { mutate: updateComment } = useUpdateComment();
	const { data: comments } = useGetCommentsByPostId(post.$id);

	const handleComment = (values: any) => {
		try {
			if (updatingCommentId) {
				updateComment({
					text: values.text,
					commentID: updatingCommentId,
				});
				setUpdatingCommentId("");
				form.resetFields();
				return;
			}

			createComment({
				text: values.text,
				postID: post.$id,
				userID: user.id,
				name: user.name,
				imageURL: user.imageURL,
			});
			form.resetFields();
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteComment = async (commentID: string) => {
		await deleteComment(commentID);
	};

	if (!post?.creator) return;

	return (
		<Card hoverable style={{ width: 800, height: 600 }}>
			<Row gutter={16}>
				{/* Left Section */}
				<Col span={12}>
					<Image
						height={550}
						alt="post image"
						src={post?.imageURL}
						style={{ objectFit: "cover" }}
					/>
				</Col>
				{/* Right Section */}
				<Col span={12}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
						}}>
						<Avatar src={post?.creator?.imageURL} size={50} />
						<div style={{ marginLeft: "16px" }}>
							<Text strong>{post?.creator?.name}</Text>
						</div>
					</div>

					<Divider />
					{/* Scrollable Section */}
					<div
						style={{
							flex: 1,
							overflowY: "auto",
							height: "250px",
						}}>
						{/* Description */}
						<Paragraph>{post?.caption}</Paragraph>
						{/* Tags */}
						<div style={{ marginBottom: "8px" }}>
							{post?.tags?.map((tag: string, index: string) => (
								<Tag style={{ margin: 3 }} key={tag + index}>
									{tag}
								</Tag>
							))}
						</div>

						{/* Comments with profile pic and username */}
						<List
							dataSource={comments?.documents}
							itemLayout="horizontal"
							renderItem={(comment) => (
								<List.Item
									actions={[
										user.id === comment.userID && (
											<Tooltip title="Edit Comment" key="edit">
												<Button
													size="small"
													shape="circle"
													icon={<EditOutlined />}
													onClick={() => {
														setUpdatingCommentId(comment.$id);
														form.setFieldValue("text", comment.text);
													}}
												/>
											</Tooltip>
										),
										user.id === comment.userID && (
											<Tooltip title="Delete Comment" key="delete">
												<Button
													size="small"
													shape="circle"
													icon={<DeleteOutlined />}
													onClick={() => handleDeleteComment(comment.$id)}
												/>
											</Tooltip>
										),
									]}>
									<List.Item.Meta
										avatar={<Avatar src={comment?.imageURL} />}
										title={comment.name}
										description={comment.text}
									/>
								</List.Item>
							)}
						/>
					</div>

					<Divider />

					<div style={{ display: "flex" }}>
						<div>
							<PostStats post={post} userID={user?.id} />
						</div>

						{user.id === post.creator.$id && (
							<Tooltip title="Edit Post">
								<Link to={`/update-post/${post?.$id}`}>
									<Button
										shape="circle"
										icon={<EditOutlined />}
										style={{ marginTop: 10 }}
									/>
								</Link>
							</Tooltip>
						)}
					</div>

					{/* Add Comment & Update Comment */}
					<Form
						form={form}
						onFinish={handleComment}
						style={{
							marginBottom: "8px",
							display: "flex",
							flexDirection: "column",
						}}>
						<Space>
							<Form.Item name="text">
								<Input
									placeholder="Add a comment..."
									style={{ width: "300px" }}
								/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Post
								</Button>
							</Form.Item>
						</Space>
					</Form>
				</Col>
			</Row>
		</Card>
	);
};

export default PostCard;

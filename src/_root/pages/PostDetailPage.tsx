import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Image,
	Layout,
	Row,
	Space,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useDeletePost, useGetPostById } from "../../tanstack-query/Queries";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { parseDate } from "../../utils/parseDate";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const PostDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useContext(AuthContext);

	//Queries
	const { data: useDeletePost } = useGetPostById(id);
	const { mutateAsync: deletePost, isPending } = useDeletePost();

	const handleDeletePost = async () => {
		await deletePost({ postID: id, imageID: post?.imageID });
		navigate(-1);
	};

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				{/* Title: Post Detail Page  */}
				<Title level={2}>Post Details Page</Title>
				<Card hoverable style={{ width: 700, margin: "auto" }}>
					<Row gutter={16}>
						{/* Left Section */}
						<Col span={12}>
							<Image
								height={330}
								width={310}
								style={{ objectFit: "cover" }}
								src={post?.imageURL}
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

							{/* Caption */}
							<div>
								<Paragraph>{post?.caption}</Paragraph>
							</div>

							{/* Tags */}
							<div>
								{post?.tags?.map((tag: string, index: string) => (
									<Tag style={{ margin: 3 }} key={tag + index}>
										{tag}
									</Tag>
								))}
							</div>

							<Divider />

							{/* Edit and delete buttons */}
							{user?.id === post?.creator.$id && (
								<div style={{ marginTop: 20 }}>
									<Space>
										<Tooltip title="Edit Post">
											<Link to={`/update-post/${post?.$id}`}>
												<Button
													shape="circle"
													icon={<EditOutlined />}
													style={{ marginLeft: "8px" }}
												/>
											</Link>
										</Tooltip>
										<Tooltip title="Delete Post">
											<Button
												onClick={handleDeletePost}
												loading={isPending}
												shape="circle"
												icon={<DeleteOutlined />}
												style={{ marginLeft: "8px" }}
											/>
										</Tooltip>
									</Space>
								</div>
							)}

							{/* Creation time */}
							<div style={{ marginTop: 15 }}>
								<Text>Posted: {parseDate(post?.$createdAt)}</Text>
							</div>
						</Col>
					</Row>
				</Card>
			</Content>
		</Layout>
	);
};

export default PostDetailPage;
